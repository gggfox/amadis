import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, FieldResolver, Mutation, ObjectType, Query, Resolver, Root } from "type-graphql";
import argon2 from 'argon2';
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import {v4} from 'uuid';
import { getConnection } from "typeorm";

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
    email(@Root() user: User,  @Ctx() {req}: MyContext){
    //this is the current user and its ok to show them their own email    
    if(req.session.userId=== user.id){
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
        return User.findOne(req.session.userId);
    }

    @Query(() => [User])
    async influencers(){
        const users = await getConnection().query(`
            SELECT * FROM "user" WHERE "userType" = 'influencer';
        `);
        console.log(users);
        return users;
    }

    @Query(() => [User])
    async users(){
        const users = await getConnection().query(`
            SELECT * FROM "user";
        `);
        console.log(users);
        return users;
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
                        message: "username doesn't exist",
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
                        message: "incorrect password",
                    },
                ],
            };
        }
       req.session.userId = user.id;
        console.log(req.session.userId);
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
}