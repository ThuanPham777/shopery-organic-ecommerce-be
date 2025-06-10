import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AddressModule } from './address/address.module';
import { ProductModule } from './product/product.module';
import { CouponModule } from './coupon/coupon.module';
import { CartModule } from './cart/cart.module';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { ManufacturerModule } from './manufacturer/manufacturer.module';
import { TagModule } from './tag/tag.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [AuthModule, AddressModule, CouponModule, ProductModule, CategoryModule,
    ManufacturerModule, BrandModule, TagModule, CartModule, ReviewModule, UserModule,
    OrderModule, PaymentModule],
})
export class ApiModule { }
