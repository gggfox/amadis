import { Product } from "../entities/Product";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class PaginatedProducts {
    @Field(() => [Product])
    products: Product[]
    @Field()
    hasMore: boolean;
}