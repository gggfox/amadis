import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import argon2 from 'argon2';
import { UsernamePasswordInput } from "../types/UsernamePasswordInput";
import { validateRegister } from "../utils/validate/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import {v4} from 'uuid';
import { getConnection } from "typeorm";
import { isAuth } from "../middleware/isAuth";
import { SocialMedia } from "../entities/SocialMedia";
import got from "got";
import { Product } from "../entities/Product";
import { UserResponse } from "../types/UserResponse";

@Resolver(User)
export class UserResolver {

    /*
        This field resolver makes sure only the logged in user can query 
        his or her own email. Recives a user and returns a string.
    */
    //.i
    @FieldResolver(() => String)
    email(
        @Root() user: User,
        @Ctx() {req}: MyContext
    ){
        if(req.session.userId === user.id){
            return user.email;
        }
        return "";
    }

    
    /*
        This mutation takes place after the forgot password
        recives a token and a new password, returns error if password is 
        weak,token expires, user dosent exist and logs in user if no errors
        are found.
    */
    //.i
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

    /*
        This mutation recives an email and creates a token that is sent to 
        the email of the user, this function always returns true in order to 
        prevent dictinoary attacks. After the execution of this mutation the
        user can use the changepassword mutation before the token time limit
        is up
    */
    //.i
    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email: string,
        @Ctx() {redis}: MyContext
    ){
        const user = await User.findOne({where: {email}});
        if(!user) {//the email is not in the DB
            return true;
        }
        const token = v4();
        await redis.set(
            'forgot-password:' + token, 
            user.id, 'ex', 
            (1000 * 60 * 60 * 24 * 3) //3 days
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
        social_media = social_media.toLowerCase();
        if(!userId || link === "" || social_media === ""){
            return false;
        }
        await SocialMedia.create({userId, link, social_media}).save();
        return true;
    }

    /*
        This mutation recives a socialmedia link and deletes the social media 
        with that link of the currently logged in user and always returns true. 
    */
    //.i
    @Mutation(() => Boolean)
    async deleteSocialMedia(
        @Arg('link',() => String)link: string,
        @Ctx() { req }: MyContext
    ){
        const userId = req.session.userId;
        if(!userId || !link || link === ""){
            return false;
        }

        const response = await getConnection()
        .createQueryBuilder()
        .delete()
        .from(SocialMedia)
        .where(
           '"userId" = :userId and link = :link',{userId: userId, link: link}
       )
       .execute();

       if(response.affected === 0){
        return false;
       }
       return true;
    }

    /*
        This query dosent recive any arguments and returns all existing users
    */
    //.i
    @Query(()=>[User])
    async users(){
        const users = await User.find();
        return users;
    }

    /*
        This query recevies a user id and returns the only user with that id 
    */
    //.i
    @Query(() => User)
    async user(
        @Arg('userId', () => Int) userId: number
    ): Promise<User | undefined>{
        return User.findOne(userId);
    }

    /*
        This mutation recives email, username, password and confirmation, 
        validates all data through middleware that returns erros if any are
        found, then it creates a new user in the DB, unless a user with same 
        unique field (username, email) exists, in which case returns error,
        in case no error is found logs the user in. 
    */
    //.i
    @Mutation(() => UserResponse)
    async register(
        @Arg('options') {email, username, password, confirmation}: UsernamePasswordInput,
        @Ctx() {req}: MyContext
    ): Promise<UserResponse> {
        const errors = validateRegister({email, username, password, confirmation});
        if(errors){
            return {errors};
        }
        const hashedPassword = await argon2.hash(password);
        let user;
        try{
           const result = await getConnection()
             .createQueryBuilder()
             .insert()
             .into(User)
             .values({
                username: username,
                email: email,
                password: hashedPassword
            })
            .returning('*')
            .execute();

            user = result.raw[0];
        }catch (err) {
            if (err.code === "23505") {// duplicate username error
                return {
                    errors: [{
                        field: "username",
                        message: "username already taken",
                    }]
                };
            }
        }
       
        req.session.userId = user.id;
        return {user};
    }

    // this mutation needs to be broken down into -> regular_login and social_login
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

    /*
        This mutation logs out the user, dosent recive any arguments and 
        return a boolean, false if any errors occur and true otherwise 
    */
    //.i
    @Mutation(() => Boolean)
    logout(
        @Ctx(){req, res}: MyContext
    ) {
       return new Promise((resolve) => {
            req.session.destroy((err) => {
                if(err) {
                    resolve(false);
                    return;
                }
                res.clearCookie("qid");
                resolve(true);
            })
        })
    }

    /*
        This Query dosent recive any arguments and returns the logged in user 
        with all of his/her saved products
    */
    //.i
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
        @Arg('productId', () => Int) productId: number,
        @Ctx() {req}: MyContext
    ){
        const userId = req.session.userId;
        if(!userId){
            return false;
        }

        const product = await Product.findOne(productId);
        const user = await User.findOne(userId);
        
        if(product && user){
            await getConnection().query(`
                INSERT INTO user_saved_products_product
                ("userId","productId")
                VALUES($1,$2)
                `, [user.id, product.id]
            );

            return true;
        }
        return false;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async unSaveProduct(
        @Arg('productId', () => Int) productId: number,
        @Ctx() {req}: MyContext
    ){
        const userId = req.session.userId;
        if(!userId){
            return false;
        }

        const product = await Product.findOne(productId);
        const user = await User.findOne(userId);
        if(product && user){
            await getConnection().query(`
                DELETE FROM user_saved_products_product
                WHERE "userId" = $1
                AND "productId" =  $2
                `, [user.id, product.id]
            );
            return true;
        }
        return false;
    }
}