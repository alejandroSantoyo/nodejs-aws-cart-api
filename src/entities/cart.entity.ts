import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "./car-item.entity";

export enum CartStatus {
    OPEN = 'OPEN',
    ORDERED = 'ORDERED',
}

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    user_id: string;

    @Column()
    created_at: string;

    @Column()
    updated_at: string;

    @Column({
        type: 'enum',
        enum: CartStatus,
        default: CartStatus.OPEN,
    })
    status: CartStatus;

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
    items: CartItem[];
  }