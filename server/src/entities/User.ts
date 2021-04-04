import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./Post";
import { Updoot } from "./Updoot";

@ObjectType()//this generator allows us to use graphql resolvers
@Entity()
export class User extends BaseEntity{
    @Field()//this generator exposes the item below to graphql
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({unique: true})
    username!: string;

    @Field()
    @Column({unique: true})
    email!: string;

    //No field we dont want to send password bia graphql
    @Column()
    password!: string;


    @OneToMany(() => Post, post => post.creator)
    posts: Post[];

    @OneToMany(() => Updoot, (updoot) => updoot.user)
    updoots: Updoot[];

    @Field()
    @Column({ default: "regular"})
    userType!: string;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
};