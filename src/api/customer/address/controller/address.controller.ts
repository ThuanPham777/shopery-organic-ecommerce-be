import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AddressService } from "../service/address.service.controller";
import { CreateAddressOutDto, CreateAddressOutRes } from "../dto/create-address.dto.out";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreateAddressInDto } from "../dto/create-address.dto.in";
import { SUCCESS } from "src/contants/response.constant";
import { ApiRes } from "src/type/custom-response.type";
import { RoleGuard } from "src/guards/role.guard";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { EUserRole } from "src/enums/user.enums";
import { Roles } from "src/api/auth/decorators/roles.decorator";

@ApiTags('Address')
@Controller('address')
@ApiBearerAuth('bearerAuth')
@UseGuards(JwtAuthGuard, RoleGuard)
export class AddressController {
    constructor(private readonly addressService: AddressService) { }

    @Post()
    @Roles(EUserRole.USER)
    @ApiOkResponse({ type: CreateAddressOutRes })
    async createAddress(@Body() address: CreateAddressInDto) {
        const result = await this.addressService.createAddress(address)
        return new ApiRes(result, SUCCESS)
    }
}

