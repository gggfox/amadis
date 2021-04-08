import "reflect-metadata";
import { COOKIE_NAME, CLIENT_NAME, __prod__, SERVER_PORT, SESSION_SECRET } from "./constants";
import express from 'express'
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from "./types";
import cors from 'cors';
import {createConnection} from 'typeorm';
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import path from "path";
import { Updoot } from "./entities/Updoot";
const main = async () => {
    const conn = await createConnection({
        type: 'postgres',
        database: 'amadis',
        username: 'postgres',
        password: 'amadis',
        logging: true,
        synchronize: true,//
        migrations: [path.join(__dirname,"./migrations/*")],
        entities: [Post, User, Updoot],
    });

    //await conn.runMigrations();
    //await Post.delete({});

    const app = express();

    const RedisStore = connectRedis(session);
    const redis = new Redis();
    app.use(cors({
        origin: CLIENT_NAME,
        credentials: true,
    }))
    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({ 
                client: redis,
                disableTouch: true,
             }),
             cookie:{
                maxAge: 1000 * 60 * 60 * 24 * 365, //1 year
                httpOnly: true,
                sameSite: 'lax', //crsf
                secure: __prod__ //only woks in https
             },
             saveUninitialized: false,
            secret: SESSION_SECRET,
            resave: false,
        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: ({req, res}): MyContext => ({ req, res, redis }),
    });

    apolloServer.applyMiddleware({ 
        app, 
        cors: false,
    });

    app.listen(SERVER_PORT, ()=>{
        console.log('server started on localhost:'+ SERVER_PORT);//
    })

};

console.log("hello there");
main().catch(err => {
    console.error(err.message);
})