import { Field, Int, ObjectType } from "type-graphql";
import { 
    BaseEntity, 
    Column, 
    CreateDateColumn, 
    Entity,
    ManyToMany,
    ManyToOne, 
    OneToMany, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn 
  } from "typeorm";
import { Post_Category } from "./Post_Category";
import { Updoot } from "./Updoot";
import { User } from "./User";

@ObjectType()//this generator allows us to use graphql resolvers
@Entity()
export class Post extends BaseEntity{
    @Field()//this generator exposes the item below to graphql
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    title!: string;

    @Field()
    @Column()
    text!: string;

    @Field()
    @Column({type: "int", default: 0})
    points!: number;

    @Field(() => Int, {nullable: true})
    voteStatus: number | null; // 1 or -1 or null

    @Field(() => Boolean, {defaultValue: false})
    saved: boolean;

    @Field()
    @Column({type:"int",default: 5})
    comision!:number;

    @Field()
    @Column({type:"int",default: 10})
    discount!:number;

    @Field()
    @Column()
    creatorId: number;

    @Field()
    @ManyToOne(() => User, user => user.posts)
    creator: User;

    @OneToMany(() => Updoot, (updoot) => updoot.post)
    updoots: Updoot[];

    @Field(() => [Post_Category], {nullable: true})
    @OneToMany(() => Post_Category, categories => categories.post)
    categories?: Post_Category[];


    @Field(() => [User], {nullable: true})
    @ManyToMany(() => User, user => user.promotes)
    promotors?: User[];


    @Field(() => [User], {nullable: true})
    @ManyToMany(() => User, user => user.savedProducts)
    interestedUsers?: User[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}