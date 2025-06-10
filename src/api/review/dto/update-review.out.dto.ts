import { ApiProperty } from "@nestjs/swagger";
import { Product } from "src/database/entities/product/product.entity";
import { User } from "src/database/entities/user/user.entity";
import { ApiRes } from "src/type/custom-response.type";

export class UpdateReviewOutDto {
    @ApiProperty({ type: Number })
    id: number;

    @ApiProperty({
        type: Number,
    })
    rating: number;

    @ApiProperty({
        type: String,
    })
    comment: string;

    @ApiProperty({
        type: Object,
    })
    product: Product;

    @ApiProperty({
        type: Object,
    })
    user: User;

    @ApiProperty({
        type: Date,
    })
    created_at: Date;

    @ApiProperty({
        type: Date,
    })
    modified_at: Date;
}


export class UpdateReviewOutRes extends ApiRes<UpdateReviewOutDto> {
    @ApiProperty({ type: UpdateReviewOutDto })
    declare data: UpdateReviewOutDto;
}
