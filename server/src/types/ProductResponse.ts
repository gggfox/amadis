import { Product } from "../entities/Product";
import { ObjectType, Field } from "type-graphql";
import { FieldError } from "./FieldError";

@ObjectType()
export class ProductResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => Product, {nullable: true})
    product?: Product;
}