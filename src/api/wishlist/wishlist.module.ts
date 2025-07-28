import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from 'src/database/entities/wishlist/wishlist.entity';
import { WishlistController } from './controller/wishlist.controller';
import { WishlistService } from './service/wishlist.service';
import { User } from 'src/database/entities/user/user.entity';
import { Product } from 'src/database/entities/product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, User, Product])],
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService],
})
export class WishlistModule {}
