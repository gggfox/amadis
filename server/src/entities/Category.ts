import { Field, ObjectType } from "type-graphql";
import { BaseEntity, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Post_Category } from "./Post_Category";
import { User } from "./User";

@ObjectType()//this generator allows us to use graphql resolvers
@Entity()
export class Category extends BaseEntity{
    @Field()
    @PrimaryColumn()
    name: String;

    @OneToMany(() => Post_Category, post_category => post_category.category)
    post_category: Post_Category[];

    @Field(() => [User], {nullable: true})
    @ManyToMany(() => User, user => user.categories)
    promotors?: User[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
};