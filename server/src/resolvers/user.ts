import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import argon2 from 'argon2';
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import {v4} from 'uuid';
import { getConnection } from "typeorm";
import { PromotorUpdoot } from "../entities/PromotorUpdoot";
import { isAuth } from "../middleware/isAuth";
import { Category } from "../entities/Category";
import { SocialMedia } from "../entities/SocialMedia";
import { Post } from "../entities/Post";

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => User, {nullable: true})
    user?: User;
}

@Resolver(User)
export class UserResolver {

    @FieldResolver(() => String)
    email(
        @Root() user: User,
        @Ctx() {req}: MyContext
    ){
        //this is the current user and its ok to show them their own email    
        if(req.session.userId === user.id){
            return user.email;
        }
        return "";
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

    @Mutation(() => UserResponse)
    async changePassword(
        @Arg('token') token: string,
        @Arg('newPassword') newPassword: string,
        @Ctx() {redis, req}: MyContext,
    ): Promise<UserResponse>{
        if(newPassword.length <= 2){
            return { 
                errors: [
                    {
                        field: "password",
                        message: "length must be greater than 2",
                    },
                ]
            };
        }

        const key = 'forgot-password:' + token;
        const userId = await redis.get(key);
       
        if(!userId) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "token expired",
                    }
                ]
            }
        }
        const userIdNum = parseInt(userId);
        const user = await User.findOne(userIdNum);

        if(!user){
            return {
                errors: [
                    {
                        field: "token",
                        message: "user no longer exists",
                    },
                ],
            };
        }

        await User.update(
            {id: userIdNum},
            {password: await argon2.hash(newPassword)}
        );
        
        await redis.del(key);
        req.session.userId = user.id;

        return{ user };
    }

    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email: string,
        @Ctx() {redis}: MyContext
    ){
        const user = await User.findOne({where: {email}});
        if(!user) {
            //the email is not in the db
            return true;
        }
        const token = v4();
        await redis.set(
            'forgot-password:' + token, 
            user.id, 'ex', 
            1000 * 60 * 60 * 24 * 3//3 days
        );
        sendEmail(email, 
            `<a href="${process.env.CORS_ORIGIN}/change-password/${token}"> reset password</a>`);    
        return true;
    }

    @Query(() => User, {nullable:true})
    me(@Ctx() { req }: MyContext) {
        if(!req.session.userId){
            return null;
        }
        return User.findOne({where: {id: req.session.userId}, relations:["savedProducts"]});
    }

    @Query(() => User, {nullable:true})
    savedProducts(@Ctx() { req }: MyContext) {
        if(!req.session.userId){
            return null;
        }
        const userId = req.session.userId;
        return User.findOne({where:{id:userId},relations:["savedProducts"]});
    }

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

    @Mutation(() => Boolean)
    async addSocialMedia(
        @Arg('link', () => String)link: string,
        @Arg('social_media',() => String)social_media: string,
        @Ctx() { req }: MyContext
    ){
        const userId = req.session.userId;
        if(!userId || link ==="" || social_media === ""){
            return false;
        }
        await SocialMedia.create({userId,link,social_media}).save();
        return true;
    }

    @Mutation(() => Boolean)
    async deleteSocialMedia(
        @Arg('link',() => String)link: string,
        @Ctx() { req }: MyContext
    ){
        const userId = req.session.userId;

        await getConnection()
        .createQueryBuilder()
        .delete()
        .from(SocialMedia)
        .where(
           '"userId" = :userId and link = :link',{userId: userId, link: link}
       )
       .execute();
       return true;
    }

    @Query(()=>[User])
    async users(){
        const users = await User.find();
        return users;
    }

    @Query(() => User)
    async user(
        @Arg('id', () => Int) id: number
    ): Promise<User | undefined>{
        return User.findOne(id);
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {req}: MyContext
    ): Promise<UserResponse> {
        const errors = validateRegister(options);
        if(errors){
            return {errors};
        }
        const hashedPassword = await argon2.hash(options.password);
        let user;
        try{
            /*User.create({
                username: options.username,
                email: options.email,
                password: hashedPassword
            }).save();*/
           const result = await getConnection()
             .createQueryBuilder()
             .insert()
             .into(User)
             .values({
                username: options.username,
                email: options.email,
                password: hashedPassword
            })
            .returning('*')
            .execute();

            user = result.raw[0];
        }catch (err) {
            //|| err.detail.includes("already exists")) {
            // duplicate username error
            if (err.code === "23505") {
                return {
                errors: [
                    {
                    field: "username",
                    message: "username already taken",
                    },
                ],
                };
            }
        }

        req.session.userId = user.id;

        return {user};
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('usernameOrEmail') usernameOrEmail: string,
        @Arg('password') password: string,
        @Ctx() {req}: MyContext
    ): Promise<UserResponse> {
        const user = await User.findOne(
            usernameOrEmail.includes('@') 
            ? { where: {email: usernameOrEmail }} 
            : { where: {username: usernameOrEmail}}
        );
        if(!user){
            return {
                errors: [
                    {
                        field: "usernameOrEmail",
                        message: "El usuario no existe",
                    },
                ],
            };
        }
        const valid = await argon2.verify(user.password, password);
        if(!valid){
            return {
                errors: [
                    {
                        field: "password",
                        message: "Contraseña equivocada",
                    },
                ],
            };
        }
        req.session.userId = user.id;
        return {user,};
    }

    @Mutation(() => Boolean)
    logout(
        @Ctx(){req, res}: MyContext
    ) {
       return new Promise((resolve) => {
            req.session.destroy((err) => {
                if(err) {
                    console.log(err);
                    resolve(false);
                    return;
                }

                res.clearCookie("qid");
                resolve(true);
            })
        })
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

    @Mutation(() => Boolean)
    async createPromotion(
        @Arg('postId',() => Int) postId: number,
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
                user_promotes_post("userId", "postId")
                values ($1, $2)`,
                [user.id, postId]
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
        @Arg('postId',() => Int) postId: number,
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

        let postExists = false;
        
        if(user.promotes){
            const promotions = user.promotes.length;
            for(let i = 0; i< promotions;i++){
                postExists ||= (user.promotes[i].id === postId);
            }
        }else{
            return false;
        }
        

        if(!postExists){
            return false;
        }
        await getConnection().transaction(async (tm) => {
            await tm.query(`
                DELETE FROM user_promotes_post
                WHERE "userId" = $1
                AND   "postId" = $2`,
                [user.id, postId]
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

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async saveProduct(
        @Arg('postId', () => Int) postId: number,
        @Ctx() {req}: MyContext
    ){
        const userId = req.session.userId;
        if(!userId){
            return false;
        }

        const product = await Post.findOne(postId);
        const user = await User.findOne(userId);
        
        if(product && user){
            await getConnection().query(`
            INSERT INTO user_saved_products_post
            ("userId","postId")
            VALUES($1,$2)
            `, [user.id, product.id]);

            return true;
        }
        return false;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async unSaveProduct(
        @Arg('postId', () => Int) postId: number,
        @Ctx() {req}: MyContext
    ){
        const userId = req.session.userId;
        if(!userId){
            return false;
        }

        const product = await Post.findOne(postId);
        const user = await User.findOne(userId);
        if(product && user){
            const res = await getConnection().query(`
            DELETE FROM user_saved_products_post
            WHERE "userId" = $1
            AND "postId" =  $2
            `, [user.id, product.id]);

            console.log("res: "+res)
            return true;
        }
        return false;
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
}