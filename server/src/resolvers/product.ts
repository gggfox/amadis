import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { Product } from "../entities/Product";
import { getConnection } from "typeorm";
import { Updoot } from "../entities/Updoot";
import { User } from "../entities/User";
import { Product_Category } from "../entities/Product_Category";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import { BlobServiceClient } from "@azure/storage-blob"
import { ProductResponse } from '../types/ProductResponse'
import { ProductInput } from '../types/ProductInput';
import { validateProduct } from "../utils/validate/validateProduct";
import { PaginatedProducts } from '../types/PaginatedProducts';

@Resolver(Product)
export class ProductResolver {

    @FieldResolver(() => String)
    textSnippet(
        @Root() root: Product
    ){
        return root.text.slice(0, 50);
    }

    @FieldResolver(() => String)
    creator(
        @Root() product: Product,
        @Ctx() {userLoader}: MyContext,
    ){
        return userLoader.load(product.creatorId);
    }

    @FieldResolver(() => Int, {nullable: true})
    async voteStatus(
        @Root() product: Product,
        @Ctx() {updootLoader, req}: MyContext,
    ){
        if(!req.session.userId){
            return null;
        }
        const updoot = await updootLoader.load({
            productId: product.id, 
            userId: req.session.userId,
        });
        return updoot ? updoot.value : null;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async vote(
        @Arg('productId', () => Int) productId: number,
        @Arg('value', () => Int) value: number,
        @Ctx() {req}: MyContext
    ) {
        
        const isUpdoot = (value !== -1);
        const userId = req.session.userId;
        const realValue = isUpdoot ? 1 : -1;
        const updoot = await Updoot.findOne({where: {productId, userId}});
    
        if(updoot && updoot.value !== realValue) {
        //changing vote
            await getConnection().transaction(async (tm) => {
                await tm.query(`
                    update updoot
                    set value = $1
                    where "productId" = $2 and "userId" = $3
                    `,[realValue, productId, userId]
                );

                await tm.query(`
                    update Product
                    set points = points + $1
                    where id = $2
                    `,[2 * realValue, productId]
                );
            });
        } else if(!updoot){
            //has never voted before
            await getConnection().transaction(async (tm) => {
                await tm.query(`
                    insert into updoot ("userId", "productId", value)
                    values ($1, $2, $3)
                    `,[userId, productId, realValue]
                );

                await tm.query(`
                    update Product
                    set points = points + $1
                    where id = $2
                    `,[realValue, productId]
                );
            });
        }

        Updoot.insert({
            userId,
            productId,
            value: realValue,
        });
        // await getConnection().query(`
        //     START TRANSACTION

        //     INSERT INTO updoot("userId", "productId", value)
        //     VALUES(${userId}, ${productId}, ${realValue})
            
        //     UPDATE Product
        //     SET points = points + ${realValue}
        //     WHERE id = ${productId}
            
        //     COMMIT;
        // `);
        return true
    }

    @Query(() => PaginatedProducts)
    async products(
        @Arg('limit',() => Int) limit: number,
        @Arg('cursor', () => String, {nullable: true}) cursor: string | null,
    ): Promise<PaginatedProducts> {
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;

        const replacements: any[] = [realLimitPlusOne]

        if(cursor) {
            replacements.push(new Date(parseInt(cursor)));
        }
        const products = await getConnection().query(`
        SELECT p.*
        FROM Product p
        ${cursor ? `WHERE p."createdAt" < $2`:""}
        ORDER BY p."createdAt" DESC
        LIMIT $1
        `, replacements);

        return { 
         products: products.slice(0, realLimit),
            hasMore: products.length === realLimitPlusOne 
        }
    }

    @Query(() => Product, {nullable: true})
    async product(
        @Arg('id', () => Int) id: number
    ): Promise<Product | undefined> {
        const product = await Product.findOne({
            where:{id: id},
            relations:["categories","promotors"]
        });
        return product;
    }


    @Query(() => [Product],{nullable: true})
    async productsByCategory(
        @Arg('categoryName', () => String)categoryName: string 
    ): Promise<Product[] | undefined> {
        const products = await getConnection().query(`
        SELECT * FROM Product p 
        LEFT JOIN Product__category pc 
        ON p.id=pc."productId" 
        WHERE pc."categoryName"= $1
        `, [categoryName]);
        
        return products;
    }


    @Mutation(() => Boolean)
    async addPicture(
        @Arg("picture", () => GraphQLUpload){createReadStream}:FileUpload,
        @Arg("productId",() => Int) productId: number,
    ){
        const ONE_MEGABYTE = 1024 * 1024;
        const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
        const blobServiceClient = BlobServiceClient.fromConnectionString(
            process.env.AZURE_STORAGE_CONNECTION_STRING as string
        )
        const containerClinet = blobServiceClient.getContainerClient("imagenes");

        try{
            await containerClinet.getBlockBlobClient(`Product:${productId}`).uploadStream(
                createReadStream(),
                uploadOptions.bufferSize,
                uploadOptions.maxBuffers,
                { blobHTTPHeaders: { blobContentType: "image/jpeg" } }
            )
            return true;
        }catch(err){
            console.log(
                `uploadStream failed, 
                 requestId - ${err.details.requestId}, 
                 statusCode - ${err.statusCode}, 
                 errorCode - ${err.details.errorCode}`
            );
        }
        return false;
    }

    @Mutation(() => ProductResponse)
    @UseMiddleware(isAuth)
    async createProduct(
        @Arg('input') input: ProductInput,
        @Ctx() {req}: MyContext
        ): Promise<ProductResponse> {
        const errors = validateProduct(input);
        if(errors){
            return {errors};
        }

        const product = await Product.create({
            title: input.title,
            text: input.text,
            price: input.price,
            quantity: input.quantity,
            creatorId: req.session.userId,
        }).save();

        const categories = input.categoryNames;
        if(categories && categories.length<=5){
            for(let i = 0;i< categories.length;i++){
                await Product_Category.create({productId:product.id,categoryName:categories[i]}).save()
            }
        }
        return {product,};
    }

    @Mutation(() => ProductResponse)
    @UseMiddleware(isAuth)
    async updateProduct(
        @Arg('productId',() => Int) productId: number,
        @Arg('input') input: ProductInput,
        @Ctx(){req}: MyContext,
    ): Promise<ProductResponse> {
        const user = await User.findOne(req.session.userId);
        let creatorId: number | undefined;

        if(user?.userType === "admin"){
           const product = await Product.findOne(productId);
           creatorId = product?.creatorId; 
        }else{
           creatorId = req.session.userId;
        }
        
        const errors = validateProduct(input);
        if(errors){
            return {errors};
        }
        const results = await getConnection()
        .createQueryBuilder()
        .update(Product)
        .set({title: input.title, text: input.text, price:input.price, quantity: input.quantity})
        .where('id = :id and "creatorId" = :creatorId',{id: productId, creatorId: creatorId})
        .returning("*")
        .execute()

        return results.raw[0];
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteProduct(
        @Arg('id', () => Int) id: number, 
        @Ctx() {req}: MyContext
    ): Promise<boolean> {
        const user = await User.findOne(req.session.userId);
        const product = await Product.findOne(id);
        if(!product){
            return false;
        }
        
        if(product.creatorId !== req.session.userId && user?.userType !== "admin"){
            throw new Error('not authorized')
        }
        await Updoot.delete({ productId: id});
        await Product_Category.delete({productId: id});
        await Product.delete({id, creatorId: product.creatorId});

        return true;
    }
}