import { InputType, Field, Int } from "type-graphql"

@InputType()
export class ProductInput {
    @Field()
    title: string
    @Field()
    text: string
    @Field(() => Int)
    price: number
    @Field(() => Int)
    quantity: number
    @Field(() => [String], {nullable: true})
    categoryNames?: string[] | null
}