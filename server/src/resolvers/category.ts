import { MyContext } from "../types";
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Category } from "../entities/Category";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { Post_Category } from "../entities/Post_Category";

@Resolver(Category)
export class CategoryResolver {

    @Query(() => [Category])
    async allCategories(){
        return await Category.find();
    }

    @Mutation(() => Category)
    async createCategory(
        @Arg('name') name: String,
        @Ctx() {req}: MyContext
    ): Promise<Category | undefined> {
        const user = await User.findOne(req.session.userId);
        if(user?.userType === "admin"){
            return Category.create({
                name
            }).save();
        }
        return undefined;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteCategory(
        @Arg('name', () => String) name: string, 
        @Ctx() {req}: MyContext
    ): Promise<boolean> {
        const user = await User.findOne(req.session.userId);
        const category = await Category.findOne(name);
        if(!category){
            return false;
        }
        
        if(user?.userType !== "admin"){
            throw new Error('not authorized')
        }
        await Post_Category.delete({ categoryName: name});
        await Category.delete({name});
        //await Post.delete({id, creatorId: req.session.userId})
        return true;
    }
}