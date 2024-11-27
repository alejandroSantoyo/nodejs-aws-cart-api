import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { CartItem } from 'src/entities/car-item.entity';


@Module({
  imports: [ OrderModule, TypeOrmModule.forFeature([Cart, CartItem]) ],
  providers: [ CartService ],
  controllers: [ CartController ]
})
export class CartModule {}
