import {Request, Response} from 'express';
import { Session, SessionData } from 'express-session';
import { Redis } from "ioredis";
import { createPromotorUpdootLoader } from './utils/loaders/createPromotorUpdootLoader';
import { createUpdootLoader } from './utils/loaders/createUpdootLoader';
import { createUserLoader } from './utils/loaders/createUserLoader';

export type MyContext = {
    req: Request & { session?: Session & Partial<SessionData> &  { userId?: number } };
    redis: Redis;
    res: Response;
    userLoader: ReturnType<typeof createUserLoader>;
    updootLoader: ReturnType<typeof createUpdootLoader>;
    promotorUpdootLoader: ReturnType<typeof createPromotorUpdootLoader>;
}