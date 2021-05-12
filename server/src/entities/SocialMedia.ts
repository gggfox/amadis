import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class SocialMedia extends BaseEntity{

    @PrimaryColumn()
    userId!: number;

    @Field()
    @Column()
    social_media!: string;

    @Field()
    @PrimaryColumn()
    link!: string;

    @ManyToOne(() => User, (user) => user.socialMedia, {
        onDelete: "CASCADE",
    })
    user!: User;

    @Field(() => String)
    @CreateDateColumn()
    createdAt!: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt!: Date;
};