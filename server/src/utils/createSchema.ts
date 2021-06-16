import { PromotorResolver } from "../resolvers/promotor";
import { buildSchema } from "type-graphql";
import { CategoryResolver } from "../resolvers/category";
import { HelloResolver } from "../resolvers/hello";
import { PostResolver } from "../resolvers/post";
import { Post_CategoryResolver } from "../resolvers/post_category";
import { UserResolver } from "../resolvers/user";

export const createSchema = () =>
    buildSchema({
        resolvers: [
            HelloResolver,
            PostResolver,
            UserResolver,
            CategoryResolver,
            Post_CategoryResolver,
            PromotorResolver,
        ]
    })