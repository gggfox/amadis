import { Arg, Int, Query, Resolver } from "type-graphql";
import { Product_Category } from "../entities/Product_Category";


@Resolver(Product_Category)
export class Product_CategoryResolver {

    @Query(() => [Product_Category])
    async allProductCategories(){
        return await Product_Category.find();
    }

    @Query(() => [Product_Category], {nullable: true})
    async productCategories(
        @Arg('productId', () => Int) productId: number
    ): Promise<Product_Category[] | undefined> {
        const product = await Product_Category.find({where:{productId:productId}})
        return product;
    }
}