import { PromotorResolver } from "../resolvers/promotor";
import { buildSchema } from "type-graphql";
import { CategoryResolver } from "../resolvers/category";
import { HelloResolver } from "../resolvers/hello";
import { ProductResolver } from "../resolvers/product";
import { Product_CategoryResolver } from "../resolvers/product_category";
import { UserResolver } from "../resolvers/user";

export const createSchema = () =>
    buildSchema({
        resolvers: [
            HelloResolver,
            ProductResolver,
            UserResolver,
            CategoryResolver,
            Product_CategoryResolver,
            PromotorResolver,
        ]
    })