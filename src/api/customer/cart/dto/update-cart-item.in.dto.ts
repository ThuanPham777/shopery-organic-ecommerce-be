import { IsNotEmpty, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class UpdateCartItemInDto {
    @ApiProperty({
        example: 2,
        minimum: 1,
    })
    @IsInt()
    @Min(1)
    quantity: number;
}