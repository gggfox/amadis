import { MyContext } from "../types";
import { Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { User } from "../entities/User";
import { getConnection } from "typeorm";
import { isAuth } from "../middleware/isAuth";
import { PromotorUpdoot } from "../entities/PromotorUpdoot";
import { Category } from "../entities/Category";
import { UserResponse } from "../types/UserResponse";

@Resolver(User)
export class PromotorResolver {

    @Query(() => [User])
    async promotores(){
        const promotores = await User.find({ where:{userType: "influencer"},relations: ["categories"] })
        return promotores;
    }

    @Query(() => User)
    async promotor(
        @Arg('id', () => Int) id: number
    ){
        const promotor = await User.findOne({ 
            where: {
                id:id
            },
            relations: ["categories","socialMedia","promotes"] 
        });
        return promotor;
    }

    @Query(() => [User],{nullable: true})
    async promotoresByCategory(
        @Arg('categoryName', () => String)categoryName: string 
    ):Promise<User[] | undefined>{
        const promotores = await getConnection().query(`
        SELECT * FROM "user" u 
        LEFT JOIN user_categories_category ucc 
        ON u.id=ucc."userId" 
        LEFT JOIN "category" c
        ON ucc."categoryName"=c.name
        WHERE c.name= $1
        `, [categoryName]);
        
        return promotores;
    }

    @Mutation(() => UserResponse, {nullable: true})
    @UseMiddleware(isAuth)
    async chooseCategories4Promotor(
        @Arg('id',() => Int) id: number,
        @Arg('categories', () => [String]) categories: string[],
    ):Promise<UserResponse>{
        //to add categories the length should be between 1-5
        if(categories.length < 1){
            return {
                errors: [
                    {
                        field: "",
                        message: "no categories",
                    },
                ],
            };
        }
        if(categories.length > 5){
            return {
                errors: [
                    {
                        field: "",
                        message: "no excedded limit of 5 categories",
                    },
                ],
            };
        }

        const promotor = await User.findOne({where: {id, userType:"influencer"}});
        
        if(!promotor){
            return {
                errors: [
                    {
                        field: "",
                        message: "no promotor found",
                    },
                ],
            };
        }
        
        let names = [] as any;
        for(let i=0; i<categories.length; i++){
            names.push({name: categories[i]});
        }
        const categories4Promotor = await Category.find({where:names});
        promotor.categories = categories4Promotor;

        await promotor.save();
        
        return {user: promotor,};
    }

    @FieldResolver(() => Int, {nullable: true})
    async influencerVoteStatus(
        @Root() user: User,
        @Ctx() {promotorUpdootLoader, req}: MyContext,
    ){
        if(!req.session.userId){
            return null;
        }
        const updoot = await promotorUpdootLoader.load({
            promotorId: user.id, 
            userId: req.session.userId,
        });
        return updoot ? updoot.value : null;
    } 

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async votePromotor(
        @Arg('promotorId', () => Int) promotorId: number,
        @Arg('value', () => Int) value: number,
        @Ctx() {req}: MyContext
    ) {
        const isUpdoot = (value !== -1);
        const {userId} = req.session;
        const realValue = isUpdoot ? 1 : -1;

        const updoot = await PromotorUpdoot.findOne({where: {promotorId, userId}});
    
        if(updoot && updoot.value !== realValue) {
        //changing vote
            await getConnection().transaction(async (tm) => {
                await tm.query(`
                    update promotor_updoot
                    set value = $1
                    where "promotorId" = $2 and "userId" = $3
                    `,[realValue, promotorId, userId]
                );

                await tm.query(`
                    update public.user
                    set "influencerPoints" = "influencerPoints" + $1
                    where id = $2
                    `,[2 * realValue, promotorId]
                );
            });
        } else if(!updoot){
            //has never voted before
            await getConnection().transaction(async (tm) => {
                await tm.query(`
                    insert into promotor_updoot ("userId", "promotorId", value)
                    values ($1, $2, $3)
                    `,[userId, promotorId, realValue]
                );

                await tm.query(`
                    update public.user
                    set "influencerPoints" = "influencerPoints" + $1
                    where id = $2
                    `,[realValue, promotorId]
                );
            });
        }

        PromotorUpdoot.insert({
            userId,
            promotorId,
            value: realValue,
        });
        return true
    }

    @Mutation(() => Boolean)
    async createPromotion(
        @Arg('productId',() => Int) productId: number,
        @Ctx(){req}:MyContext
    ){
        const userId = req.session.userId;
        const user = await User.findOne(userId);
        if(user?.userType !== "influencer" && user?.userType !== "admin"){
            return false;
        }
        if(user.activePromotions > 5){
            return false;
        }

        await getConnection().transaction(async (tm) => {
            await tm.query(`
                insert into 
                user_promotes_product("userId", "productId")
                values ($1, $2)`,
                [user.id, productId]
            );

            await tm.query(`
                update public.user
                set "activePromotions" = "activePromotions" + 1
                where id = $1`,
                [user.id]
            );
        });
        return true;
        //create query builder
    }

    @Mutation(() => Boolean)
    async deletePromotion(
        @Arg('productId',() => Int) productId: number,
        @Ctx(){req}:MyContext
    ){
        const userId = req.session.userId;
        const user = await User.findOne({
            where:{id:userId},
            relations: ["promotes"] 
        });
        if(user?.userType !== "influencer" && user?.userType !== "admin"){
            return false;
        }

        if(user.activePromotions <= 0 ){
            return false;
        }

        let productExists = false;
        
        if(user.promotes){
            const promotions = user.promotes.length;
            for(let i = 0; i< promotions;i++){
                productExists ||= (user.promotes[i].id === productId);
            }
        }else{
            return false;
        }
        

        if(!productExists){
            return false;
        }
        await getConnection().transaction(async (tm) => {
            await tm.query(`
                DELETE FROM user_promotes_product
                WHERE "userId" = $1
                AND   "productId" = $2`,
                [user.id, productId]
            );

            await tm.query(`
                update public.user
                set "activePromotions" = "activePromotions" - 1
                where id = $1`,
                [user.id]
            );
        });
        return true;
        //create query builder
    }
}