import "reflect-metadata";
import "dotenv-safe/config";
import { __prod__, } from "./constants";
import express from 'express'
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { CategoryResolver } from "./resolvers/category"
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { Updoot } from "./entities/Updoot";
import { Category } from "./entities/Category";
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from "./types";
import cors from 'cors';
import {createConnection} from 'typeorm';
import path from "path";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpdootLoader } from "./utils/createUpdootLoader";
import { Post_Category } from "./entities/Post_Category";
import { Post_CategoryResolver } from "./resolvers/post_category";
import { PromotorUpdoot } from "./entities/PromotorUpdoot";
import { createPromotorUpdootLoader } from "./utils/createPromotorUpdootLoader";
import { SocialMedia } from "./entities/SocialMedia";
import { graphqlUploadExpress } from "graphql-upload";

const main = async () => {
    await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        logging: true,
        synchronize: true,//
        migrations: [path.join(__dirname,"./migrations/*")],
        entities: [Post, User, Updoot, Category, Post_Category,PromotorUpdoot,SocialMedia],
    });
    //console.log(conn);
    //await conn.runMigrations();
    //await Post.delete({});

    const app = express();

    const RedisStore = connectRedis(session);
    const redis = new Redis(process.env.REDIS_URL);
    app.set("trust proxy",1);
    app.use(cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }))
    app.use(
        session({
            name: "qid",
            store: new RedisStore({ 
                client: redis,
                disableTouch: true,
             }),
             cookie:{
                maxAge: 1000 * 60 * 60 * 24 * 365, //1 year
                httpOnly: true,
                sameSite: 'lax', //crsf
                secure: __prod__, //only woks in https
                domain: __prod__ ? 'amadis.club' : undefined,//needs a custom domain
             },
             saveUninitialized: false,
            secret: process.env.SESSION_SECRET,
            resave: false,
        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver, CategoryResolver, Post_CategoryResolver],
            validate: false,
        }),
        context: ({req, res}): MyContext => ({ 
            req, 
            res, 
            redis,
            userLoader: createUserLoader(),
            updootLoader: createUpdootLoader(),
            promotorUpdootLoader: createPromotorUpdootLoader(),
        }),
        uploads: false
    });

    app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));

    apolloServer.applyMiddleware({ 
        app, 
        cors: false,
    });

    app.listen(parseInt(process.env.PORT), ()=>{
        console.log('server started on localhost:'+ process.env.PORT);//
    })

};

main().catch(err => {
    console.error(err.message);
})