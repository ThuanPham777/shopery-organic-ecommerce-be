import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { OrderService } from "../service/order.service";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RoleGuard } from "src/guards/role.guard";
import { Roles } from "src/api/auth/decorators/roles.decorator";
import { EUserRole } from "src/enums/user.enums";
import { SUCCESS } from "src/contants/response.constant";
import { ApiRes } from "src/type/custom-response.type";
import { CreateOrderInDto } from "../dto/create-order.in.dto";
import { CreateOrderOutRes } from "../dto/create-order.out.dto";
import { Request } from "express";
import { OrderDetail } from "src/database/entities/order/order-detail.entity";
import { GetOrderDetailOutDto } from "src/api/admin/order/dto/get-order-detail.out.dto";

interface RequestWithUser extends Request {
    user: {
        id: number;
    }
}

@ApiTags("Order")
@Controller("order")
@ApiBearerAuth('bearerAuth')
@UseGuards(JwtAuthGuard, RoleGuard)
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Get(":id")
    @Roles(EUserRole.USER)
    @ApiOkResponse({ type: GetOrderDetailOutDto })
    async getOrderById(@Param("id") id: number) {
        const result = await this.orderService.getOrderById(id)
        return new ApiRes(result, SUCCESS)
    }

    @Post()
    @Roles(EUserRole.USER)
    @ApiOkResponse({ type: CreateOrderOutRes })
    async createOrder(@Body() createOrderInDto: CreateOrderInDto, @Req() req: RequestWithUser) {
        const userId = req.user.id
        const result = await this.orderService.createOrder(createOrderInDto, userId)
        return new ApiRes(result, SUCCESS)
    }
}