import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Category } from "./Category";
import { Product } from "./Product";

@ObjectType()
@Entity()
export class Product_Category extends BaseEntity{

    @Field(() => Int)
    @PrimaryColumn({type: "int"})
    productId: number;

    @Field()
    @PrimaryColumn()
    categoryName: string;

    @ManyToOne(() => Product,(product) => product.categories, {
        onDelete: "CASCADE",
    })
    product: Product;

    @ManyToOne(() => Category,(category) => category.post_category, {
        onDelete: "CASCADE",
    })
    category: Category;
};