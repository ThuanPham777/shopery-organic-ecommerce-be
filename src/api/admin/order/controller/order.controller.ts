import { Body, Controller, Get, Param, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { EUserRole } from "src/enums/user.enums";
import { GetAllOrdersOutRes } from "../dto/get-all-orders.out.dto";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RoleGuard } from "src/guards/role.guard";
import { ApiNullableRes, ApiPagRes, ApiRes } from "src/type/custom-response.type";
import { SUCCESS } from "src/contants/response.constant";
import { Roles } from "src/api/auth/decorators/roles.decorator";
import { OrderService } from "../service/order.service";
import { GetAllOrdersDtoIn } from "../dto/get-all-orders.in.dto";
import { GetOrderDetailOutDto } from "../dto/get-order-detail.out.dto";
import { UpdateOrderInDto } from "../dto/update-order.in.dto";

@ApiTags("Admin / Order")
@Controller("admin/order")
@ApiBearerAuth('bearerAuth')
@UseGuards(JwtAuthGuard, RoleGuard)
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Get()
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: GetAllOrdersOutRes })
    async getAllOrders(@Query() query: GetAllOrdersDtoIn) {
        const { page, perPage } = query
        const result = await this.orderService.getAllOrders(query)
        return new ApiPagRes(result.orders, result.total, page, perPage, SUCCESS)
    }

    @Get(":id")
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: GetOrderDetailOutDto })
    async getOrderById(@Param("id") id: number) {
        const result = await this.orderService.getOrderById(id)
        return new ApiRes(result, SUCCESS)
    }

    @Put(":id")
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: ApiNullableRes })
    async updateOrder(@Param("id") id: number, @Body() updateOrderInDto: UpdateOrderInDto) {
        await this.orderService.updateOrder(id, updateOrderInDto)
        return new ApiNullableRes(null, SUCCESS)
    }
}
