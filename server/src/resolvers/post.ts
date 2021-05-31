import { isAuth } from "../middleware/isAuth";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, FieldResolver, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { Post } from "../entities/Post";
import { getConnection } from "typeorm";
import { Updoot } from "../entities/Updoot";
import { User } from "../entities/User";
import { Post_Category } from "../entities/Post_Category";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import { BlobServiceClient } from "@azure/storage-blob"


@InputType()
class PostInput {
    @Field()
    title: string
    @Field()
    text: string
    @Field(() => [String], {nullable: true})
    categoryNames?: string[] | null
}

@ObjectType()
class PaginatedPosts {
    @Field(() => [Post])
    posts: Post[]
    @Field()
    hasMore: boolean;
}

@ObjectType()
class PostFieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class PostResponse {
    @Field(() => [PostFieldError], {nullable: true})
    errors?: PostFieldError[];

    @Field(() => Post, {nullable: true})
    post?: Post;
}

@Resolver(Post)
export class PostResolver {

    @FieldResolver(() => String)
    textSnippet(
        @Root() root: Post
    ){
        return root.text.slice(0, 50);
    }

    @FieldResolver(() => String)
    creator(
        @Root() post: Post,
        @Ctx() {userLoader}: MyContext,
    ){
        return userLoader.load(post.creatorId);
    }

    @FieldResolver(() => Int, {nullable: true})
    async voteStatus(
        @Root() post: Post,
        @Ctx() {updootLoader, req}: MyContext,
    ){
        if(!req.session.userId){
            return null;
        }
        const updoot = await updootLoader.load({
            postId: post.id, 
            userId: req.session.userId,
        });
        return updoot ? updoot.value : null;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async vote(
        @Arg('postId', () => Int) postId: number,
        @Arg('value', () => Int) value: number,
        @Ctx() {req}: MyContext
    ) {
        
        const isUpdoot = (value !== -1);
        const userId = req.session.userId;
        const realValue = isUpdoot ? 1 : -1;


        const updoot = await Updoot.findOne({where: {postId, userId}});
    
        if(updoot && updoot.value !== realValue) {
        //changing vote
            await getConnection().transaction(async (tm) => {
                await tm.query(`
                    update updoot
                    set value = $1
                    where "postId" = $2 and "userId" = $3
                    `,[realValue, postId, userId]
                );

                await tm.query(`
                    update post
                    set points = points + $1
                    where id = $2
                    `,[2 * realValue, postId]
                );
            });
        } else if(!updoot){
            //has never voted before
            await getConnection().transaction(async (tm) => {
                await tm.query(`
                    insert into updoot ("userId", "postId", value)
                    values ($1, $2, $3)
                    `,[userId, postId, realValue]
                );

                await tm.query(`
                    update post
                    set points = points + $1
                    where id = $2
                    `,[realValue, postId]
                );
            });
        }

        Updoot.insert({
            userId,
            postId,
            value: realValue,
        });
        // await getConnection().query(`
        //     START TRANSACTION

        //     INSERT INTO updoot("userId", "postId", value)
        //     VALUES(${userId}, ${postId}, ${realValue})
            
        //     UPDATE post
        //     SET points = points + ${realValue}
        //     WHERE id = ${postId}
            
        //     COMMIT;
        // `);
        return true
    }

    @Query(() => PaginatedPosts)
    async posts(
        @Arg('limit',() => Int) limit: number,
        //when an arg is nullable you need to explicitly set the type
        @Arg('cursor', () => String, {nullable: true}) cursor: string | null,
    ): Promise<PaginatedPosts> {
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;

        const replacements: any[] = [realLimitPlusOne]

        if(cursor) {
            replacements.push(new Date(parseInt(cursor)));
        }
        const posts = await getConnection().query(`
        SELECT p.*
        FROM post p
        ${cursor ? `WHERE p."createdAt" < $2`:""}
        ORDER BY p."createdAt" DESC
        LIMIT $1
        `, replacements);

        return { 
            posts: posts.slice(0, realLimit),
            hasMore: posts.length === realLimitPlusOne 
        }
    }

    @Query(() => Post, {nullable: true})
    async post(
        @Arg('id', () => Int) id: number
    ): Promise<Post | undefined> {
        const post = await Post.findOne({
            where:{id: id},
            relations:["categories","promotors"]
        });
        return post;
    }


    @Query(() => [Post],{nullable: true})
    async postsByCategory(
        @Arg('categoryName', () => String)categoryName: string 
    ): Promise<Post[] | undefined> {
        const posts = await getConnection().query(`
        SELECT * FROM post p 
        LEFT JOIN post__category pc 
        ON p.id=pc."postId" 
        WHERE pc."categoryName"= $1
        `, [categoryName]);
        
        return posts;
    }


    @Mutation(() => Boolean)
    async addPicture(
        @Arg("picture", () => GraphQLUpload){createReadStream}:FileUpload,
        @Arg("postId",() => Int) postId: number,
    ){
        const ONE_MEGABYTE = 1024 * 1024;
        const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
        const blobServiceClient = BlobServiceClient.fromConnectionString(
            process.env.AZURE_STORAGE_CONNECTION_STRING as string
        )
        const containerClinet = blobServiceClient.getContainerClient("imagenes");

        try{
            await containerClinet.getBlockBlobClient(`post:${postId}`).uploadStream(
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


        // return new Promise(
        //     async (resolve, reject) => {
        //         createReadStream()
        //             .pipe(createWriteStream(__dirname + `/../../images/${filename}`))
        //             .on("finish", () => resolve(true))
        //             .on("error", () => reject(false))
        //     }
        // );
    }

    @Mutation(() => PostResponse)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg('input') input: PostInput,
        @Ctx() {req}: MyContext
        ): Promise<PostResponse> {
            let errors: PostFieldError[] = [];
        if(input.title.trim() === ""){
                errors.push({
                    field: "title",
                    message: "se necesita un titulo para el producto",
                });
        }
        
        if(input.text.trim() === ""){
            errors.push({
                field: "text",
                message: "se necesita una descripcion para el producto",
            });
        }

        if(errors.length > 0){
            return {errors,}
        }

        const post = await Post.create({
            title: input.title,
            text: input.text,
            creatorId: req.session.userId,
        }).save();

        const categories = input.categoryNames;
        if(categories && categories.length<=5){
            for(let i = 0;i< categories.length;i++){
                await Post_Category.create({postId:post.id,categoryName:categories[i]}).save()
            }
        }
        return {post,};
    }

    @Mutation(() => Post, {nullable: true})
    @UseMiddleware(isAuth)
    async updatePost(
        @Arg('id',() => Int) id: number,
        @Arg('title') title: string,
        @Arg('text') text:string,
        @Ctx(){req}: MyContext,
    ): Promise<Post |  null> {
        const user = await User.findOne(req.session.userId);
        let creatorId: number | undefined;

        if(user?.userType === "admin"){
           const post = await Post.findOne(id);
           creatorId = post?.creatorId; 
        }else{
           creatorId = req.session.userId;
        }
        
        const results = await getConnection()
        .createQueryBuilder()
        .update(Post)
        .set({title, text})
        .where('id = :id and "creatorId" = :creatorId',{id, creatorId: creatorId})
        .returning("*")
        .execute()

        return results.raw[0];
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deletePost(
        @Arg('id', () => Int) id: number, 
        @Ctx() {req}: MyContext
    ): Promise<boolean> {
        const user = await User.findOne(req.session.userId);
        const post = await Post.findOne(id);
        if(!post){
            return false;
        }
        
        if(post.creatorId !== req.session.userId && user?.userType !== "admin"){
            throw new Error('not authorized')
        }
        await Updoot.delete({ postId: id});
        await Post_Category.delete({postId: id});
        await Post.delete({id, creatorId: post.creatorId});

        return true;
    }
}