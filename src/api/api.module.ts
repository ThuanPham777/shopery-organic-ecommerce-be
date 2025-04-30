import { Module } from '@nestjs/common';
import { AdminApiModule } from './admin/admin.module';
import { CustomerApiModule } from './customer/customer.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AdminApiModule, CustomerApiModule, AuthModule],
})
export class ApiModule {}
