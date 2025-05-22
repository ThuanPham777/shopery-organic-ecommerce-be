import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/database/entities/user/user.entity";
import { Product } from "src/database/entities/product/product.entity";
import { ApiPag, ApiPagRes } from "src/type/custom-response.type";

export class GetAllReviewsOfSingleProductOutDto {
    @ApiProperty({ type: Number })
    id: number;

    @ApiProperty({ type: Number })
    rating: number;

    @ApiProperty({ type: String })
    comment: string;

    @ApiProperty({ type: Date })
    created_at: Date;

    @ApiProperty({ type: Date })
    updated_at: Date;

    @ApiProperty({ type: Date })
    deleted_at: Date;

    @ApiProperty({ type: Object })
    product: Product;

    @ApiProperty({ type: Object })
    user: User;
}


export class GetAllReviewsOfSingleProductPagDto extends ApiPag {
    @ApiProperty({ type: GetAllReviewsOfSingleProductOutDto, isArray: true })
    declare items: GetAllReviewsOfSingleProductOutDto[];
}

export class GetAllReviewsOfSingleProductOutRes extends ApiPagRes {
    @ApiProperty({ type: GetAllReviewsOfSingleProductPagDto })
    declare data: GetAllReviewsOfSingleProductPagDto;
}
