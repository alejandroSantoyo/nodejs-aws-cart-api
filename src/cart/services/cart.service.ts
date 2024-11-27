import { Injectable } from '@nestjs/common';

import { Cart } from '../models';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart as CartEntity, CartStatus } from 'src/entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from 'src/entities/car-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,

    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) { }


  private userCarts: Record<string, Cart> = {};

  findByUserId(userId: string) {
    return this.cartRepository.findOne({
      where: { user_id: userId },
      relations: ['items']
    });
  }

  async createByUserId(userId: string) {
    try {
      const cart = await this.cartRepository.create({
        user_id: userId,
        status: CartStatus.OPEN,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      return this.cartRepository.save(cart);
    } catch (error) {
      console.error("Error creating cart", error)
    }
  }

  async findOrCreateByUserId(userId: string = "1"): Promise<CartEntity> {
    try {
      const userCart = await this.findByUserId(userId);

      if (userCart) {
        return userCart;
      }

      return this.createByUserId(userId);
    } catch (error) {
      console.error("findOrCreateByUserId:error", error)
    }
  }

  async updateByUserId(userId: string = "1", { items }: Cart): Promise<CartEntity> {
    const cart = await this.findOrCreateByUserId(userId);

    // Add new items to the cart
    const itemsToAdd = items.map((item) =>
      this.cartItemRepository.create({
        ...item,
        cart, // Associate the item with the cart
      }),
    );

    // Save new items
    const savedItems = await this.cartItemRepository.save(itemsToAdd);

    // Update and save the cart
    return await this.cartRepository.save({
      ...cart,
      items: [...cart.items, ...savedItems],
      updated_at: new Date().toISOString()
    });

  }

  async removeByUserId(userId: string = "1"): Promise<void> {
    const cart = await this.findByUserId(userId);
    this.cartRepository.delete(cart.id)
  }

}
