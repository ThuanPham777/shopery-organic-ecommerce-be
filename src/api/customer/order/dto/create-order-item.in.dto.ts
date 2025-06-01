import { IsNotEmpty, IsNumber } from "class-validator";

export class createOrderItemInDto {
    @IsNotEmpty()
    @IsNumber()
    productId: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}