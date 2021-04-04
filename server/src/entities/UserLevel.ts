import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()//this generator allows us to use graphql resolvers
@Entity()
export class UserLevel extends BaseEntity{
    @Field()//this generator exposes the item below to graphql
    @PrimaryGeneratedColumn()
    id!: number;

    //No field we dont want to send password bia graphql
    @Field()
    @Column()
    exp!: number;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
};