import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Category } from "./Category";
import { Post } from "./Post";

@ObjectType()
@Entity()
export class Post_Category extends BaseEntity{

    @Field(() => Int)
    @PrimaryColumn({type: "int"})
    postId: number;

    @Field()
    @PrimaryColumn()
    categoryName: string;

    @ManyToOne(() => Post,(post) => post.categories, {
        onDelete: "CASCADE",
    })
    post: Post;

    @ManyToOne(() => Category,(category) => category.post_category, {
        onDelete: "CASCADE",
    })
    category: Category;
};