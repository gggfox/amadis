import { MyContext } from "../types";
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { Category } from "../entities/Category";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { Product_Category } from "../entities/Product_Category";
import { getConnection } from "typeorm";
import { FieldError } from "../types/FieldError";

@ObjectType()
export class CategoryResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => Category, {nullable: true})
    category?: Category;
}


@Resolver(Category)
export class CategoryResolver {

    @Query(() => [Category])
    async allCategories(){
        return await Category.find();
    }

    @Mutation(() => CategoryResponse)
    async createCategory(
        @Arg('name') name: String,
        @Ctx() {req}: MyContext
    ): Promise<CategoryResponse> {
        const user = await User.findOne(req.session.userId);
        if(user?.userType !== "admin"){
            return {
                errors: [{
                    field: "category",
                    message: "No es admin",
                }]
            };
        }

        if(name.trim() === ""){
            return {
                errors: [{
                    field: "category",
                    message: "No puede haber categorias vacias",
                }]
            };
        }

        let category;
        try{
            const result = await getConnection()
              .createQueryBuilder()
              .insert()
              .into(Category)
              .values({
                 name: name,
             })
             .returning('*')
             .execute();
 
            category = result.raw[0];
         }catch (err) {
             // duplicate username error
             if (err.code === "23505") {
                 return {
                 errors: [
                     {
                     field: "category",
                     message: "Esa categoria ya existe",
                     },
                 ],
                 };
             }
         }
 
        return { category };
        
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
        await Product_Category.delete({ categoryName: name});
        await Category.delete({name});
        //await Post.delete({id, creatorId: req.session.userId})
        return true;
    }
}