import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./Category";
import { Product } from "./Product";
import { SocialMedia } from "./SocialMedia";
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

    @OneToMany(() => Product, products => products.creator)
    products: Product[];

    @OneToMany(() => Updoot, (updoot) => updoot.user)
    updoots: Updoot[];

    @Field(() => [SocialMedia],{nullable: true})
    @OneToMany(() => SocialMedia, (socialMedia) => socialMedia.user)
    socialMedia?: SocialMedia[];

    @Field()
    @Column({ default: "regular"})
    userType!: string;

    //promotor vote status
    @Field(() => Int, {nullable: true})
    influencerVoteStatus: number | null; // 1 or -1 or null

    //promotor points
    @Field()
    @Column({type: "int", default: 0})
    influencerPoints!: number;

    @Field()
    @Column({type:"int", default:0})
    activePromotions!: number;

    @OneToMany(() => Updoot, (updoot) => updoot.product)
    influencerUpdoots: Updoot[];

    @Field(() => [Category], {nullable: true})
    @ManyToMany(() => Category, categories => categories.promotors)
    @JoinTable()
    categories?: Category[];

    @Field(() => [Product], {nullable: true})
    @ManyToMany(() => Product, product => product.promotors)
    @JoinTable()
    promotes?: Product[];

    @Field(() => [Product], {nullable: true})
    @ManyToMany(() => Product, product => product.interestedUsers)
    @JoinTable()
    savedProducts?: Product[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
};