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
import { Product_Category } from "./Product_Category";
import { Updoot } from "./Updoot";
import { User } from "./User";

@ObjectType()//this generator allows us to use graphql resolvers
@Entity()
export class Product extends BaseEntity{
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

    @Field(() => Int, {nullable: false})
    @Column({type:"int", default: 0})
    quantity: number;

    @Field(() => Int, {nullable: false})
    @Column({type:"int",default: 200})
    price!:number;

    @Field(() => Int, {nullable: false})
    @Column({type:"int",default: 5})
    comision!:number;

    @Field(() => Int, {nullable: false})
    @Column({type:"int",default: 10})
    discount!:number;

    @Field(() => Int, {nullable: false})
    @Column({type: "int"})
    creatorId: number;

    @Field(() => User, {nullable: false})
    @ManyToOne(() => User, user => user.products)
    creator: User;

    @OneToMany(() => Updoot, (updoot) => updoot.product)
    updoots: Updoot[];

    @Field(() => [Product_Category], {nullable: true})
    @OneToMany(() => Product_Category, categories => categories.product)
    categories?: Product_Category[];


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