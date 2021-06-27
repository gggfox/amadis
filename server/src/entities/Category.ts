import { Field, ObjectType } from "type-graphql";
import { BaseEntity, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Product_Category } from "./Product_Category";
import { User } from "./User";

@ObjectType()//this generator allows us to use graphql resolvers
@Entity()
export class Category extends BaseEntity{
    @Field()
    @PrimaryColumn()
    name: String;

    @OneToMany(() => Product_Category, product_category => product_category.category)
    post_category: Product_Category[];

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