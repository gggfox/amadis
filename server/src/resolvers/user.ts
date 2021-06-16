import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import argon2 from 'argon2';
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import {v4} from 'uuid';
import { getConnection } from "typeorm";
import { isAuth } from "../middleware/isAuth";
import { SocialMedia } from "../entities/SocialMedia";
import got from "got";
import { Post } from "../entities/Post";
import { UserResponse } from "./UserResponse";

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

    @Mutation(() => UserResponse)
    async changePassword(
        @Arg('token') token: string,
        @Arg('newPassword') newPassword: string,
        @Ctx() {redis, req}: MyContext,
    ): Promise<UserResponse>{
        if(newPassword.length <= 2){
            return { 
                errors: [{
                    field: "password",
                    message: "length must be greater than 2",
                }]
            };
        }

        const key = 'forgot-password:' + token;
        const userId = await redis.get(key);
       
        if(!userId) {
            return {
                errors: [{
                    field: "token",
                    message: "token expired",
                }]
            }
        }
        const userIdNum = parseInt(userId);
        const user = await User.findOne(userIdNum);

        if(!user){
            return {
                errors: [{
                    field: "token",
                    message: "user no longer exists",
                }]
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
        @Arg('options') {email, username, password}: UsernamePasswordInput,
        @Ctx() {req}: MyContext
    ): Promise<UserResponse> {
        const options = {email, username, password};
        const errors = validateRegister(options);
        if(errors){
            return {errors};
        }
        const hashedPassword = await argon2.hash(options.password);
        let user;
        try{
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
        @Arg('socialMedia') socialMedia: string,
        @Arg('token') token: string,
        @Ctx() {req}: MyContext
    ): Promise<UserResponse> {
      
        console.log("token " + token)
        let user = null
        if (token !== ""){


            if(socialMedia === "facebook"){


                const response = await got("https://graph.facebook.com/me?access_token=" + token)
                const {name} = JSON.parse(response.body)

                if(name === usernameOrEmail){
                     user = await User.findOne(
                        {where : {username : usernameOrEmail }} 
                        )
                        if (!user){
                            const hashedPassword = await argon2.hash(password);
                           
                            try{
                               const result = await getConnection()
                                 .createQueryBuilder()
                                 .insert()
                                 .into(User)
                                 .values({
                                    username: usernameOrEmail,
                                    email: "",
                                    password: hashedPassword
                                })
                                .returning('*')
                                .execute();
                    
                                user = result.raw[0];
                            }catch (err) {
                                console.log(err)
                                }
                            }

                        }
                }
                if(socialMedia === "google"){


                const response = await got("https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=" + token)
                const {email} = JSON.parse(response.body)

                if(email === usernameOrEmail){
                    user = await User.findOne(
                        {where : {email : usernameOrEmail }} 
                    )
                    if (!user){
                        const hashedPassword = await argon2.hash(password);       
                        try{
                            const result = await getConnection()
                                .createQueryBuilder()
                                .insert()
                                .into(User)
                                .values({
                                username: usernameOrEmail,
                                email: usernameOrEmail,
                                password: hashedPassword
                            })
                            .returning('*')
                            .execute();
                
                            user = result.raw[0];
                        }catch (err) {
                            console.log(err)
                        }
                    }
                }
            }

        }else{
            user = await User.findOne(
                usernameOrEmail.includes('@') 
                ? { where: {email: usernameOrEmail }} 
                : { where: {username: usernameOrEmail}}
            );

        }        
       
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

    @Query(() => User, {nullable:true})
    savedProducts(@Ctx() { req }: MyContext) {
        if(!req.session.userId){
            return null;
        }
        const userId = req.session.userId;
        return User.findOne({where:{id:userId},relations:["savedProducts"]});
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
}