import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment } from "src/database/entities/payment/payment.entity";
import { PaymentController } from "./controller/payment.controller";
import { PaymentService } from "./service/payment.service";
import { Module } from "@nestjs/common";


@Module({
    imports: [TypeOrmModule.forFeature([Payment])],
    controllers: [PaymentController],
    providers: [PaymentService],
    exports: [PaymentService]
})
export class PaymentModule { }
