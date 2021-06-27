import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Product } from "./Product";
import { User } from "./User";

@Entity()
export class Updoot extends BaseEntity{

    @Column({type: "int"})
    value: number;

    @PrimaryColumn()
    userId: number;

    @ManyToOne(() => User,(user) => user.updoots)
    user: User;

    @PrimaryColumn()
    productId: number;

    @ManyToOne(() => Product, (product) => product.updoots, {
        onDelete: "CASCADE",
    })
    product: Product;

}