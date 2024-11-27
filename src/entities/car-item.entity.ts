import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    product_id: number;

    @Column()
    count: number;

    @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
    cart: Cart;  
}