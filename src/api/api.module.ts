import { Module } from '@nestjs/common';
import { AdminApiModule } from './admin/admin.module';
import { CustomerApiModule } from './customer/customer.module';

@Module({
  imports: [AdminApiModule, CustomerApiModule],
})
export class ApiModule {}
