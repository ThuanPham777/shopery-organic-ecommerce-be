import { CreatePaymentOutRes } from "../dto/create-payment.dto.out";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreatePaymentInDto } from "../dto/create-payment.dto.in";
import { PaymentService } from "../service/payment.service";
import { SUCCESS } from "src/contants/response.constant";
import { ApiRes } from "src/type/custom-response.type";
import { Body, Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RoleGuard } from "src/guards/role.guard";
import { EUserRole } from "src/enums/user.enums";
import { Roles } from "src/api/auth/decorators/roles.decorator";
import { PaymentMethod } from "src/database/entities/payment/payment.entity";

@ApiTags("Payment")
@Controller("payment")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post()
    @Roles(EUserRole.USER)
    @ApiOkResponse({ type: CreatePaymentOutRes })
    async createPayment(@Body() payment: CreatePaymentInDto) {
        const result = await this.paymentService.createPayment(payment)
        return new ApiRes(result, SUCCESS)
    }

    @Post(':id/process')
    @Roles(EUserRole.USER)
    async processPayment(
        @Param('id') paymentId: string,
        @Body() body: { method: PaymentMethod; data: any },
    ) {
        const result = await this.paymentService.processPayment(
            paymentId,
            body.method,
            body.data,
        );
        return new ApiRes(result, SUCCESS)
    }

    @Post(':id/stripe/intent')
    @Roles(EUserRole.USER)
    async createStripeIntent(@Param('id') paymentId: string) {
        const result = await this.paymentService.createStripePaymentIntent(paymentId);
        return new ApiRes(result, SUCCESS)
    }

    // @Post(':id/paypal/order')
    // @Roles(EUserRole.USER)
    // async createPaypalOrder(@Param('id') paymentId: string) {
    //     const result = await this.paymentService.createPaypalOrder(paymentId);
    //     return new ApiRes(result, SUCCESS)
    // }
}