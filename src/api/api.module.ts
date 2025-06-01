import { Module } from '@nestjs/common';
import { AdminApiModule } from './admin/admin.module';
import { CustomerApiModule } from './customer/customer.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './customer/cart/cart.module';
import { OrderModule } from './customer/order/order.module';

@Module({
  imports: [AdminApiModule, CustomerApiModule, AuthModule, CartModule, OrderModule],
})
export class ApiModule { }
