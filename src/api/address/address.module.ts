import { TypeOrmModule } from "@nestjs/typeorm";
import { AddressService } from "./service/address.service.controller";
import { AddressController } from "./controller/address.controller";
import { Address } from "src/database/entities/address/address.entity";
import { Module } from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([Address])],
    controllers: [AddressController],
    providers: [AddressService],
})
export class AddressModule { }
