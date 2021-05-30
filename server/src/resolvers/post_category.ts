import { Arg,Int, Query, Resolver } from "type-graphql";
import { Post_Category } from "../entities/Post_Category";


@Resolver(Post_Category)
export class Post_CategoryResolver {

    @Query(() => [Post_Category])
    async allPostCategories(){
        return await Post_Category.find();
    }

    @Query(() => [Post_Category], {nullable: true})
    async postCategories(
        @Arg('postId', () => Int) postId: number
    ): Promise<Post_Category[] | undefined> {
        const post = await Post_Category.find({where:{postId:postId}})
        return post;
    }
}