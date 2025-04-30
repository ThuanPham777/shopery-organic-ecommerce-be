import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/database/entities/cart/cart.entity';
import { CartController } from './controller/cart.controller';
import { CartService } from './service/cart.service';
import { CartItem } from 'src/database/entities/cart/cart-item.entity';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem]), RedisModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
