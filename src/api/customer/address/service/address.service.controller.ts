import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Address } from "src/database/entities/address/address.entity";
import { CreateAddressInDto } from "../dto/create-address.dto.in";

export class AddressService {
    constructor(
        @InjectRepository(Address)
        private addressRepository: Repository<Address>
    ) { }

    async createAddress(address: CreateAddressInDto): Promise<Address> {
        return this.addressRepository.save(address);
    }

}

