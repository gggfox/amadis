import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class PromotorUpdoot extends BaseEntity{

    @Column({type: "int"})
    value: number;

    @PrimaryColumn()
    userId: number;

    @ManyToOne(() => User,(user) => user.updoots)
    user: User;

    @PrimaryColumn()
    promotorId: number;

    @ManyToOne(() => User, (promotor) => promotor.updoots, {
        onDelete: "CASCADE",
    })
    promotor: User;
}