import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, Max, IsString } from 'class-validator';
import { INVALID_NUMBER, INVALID_REQUIRED, INVALID_STRING } from 'src/contants/invalid.constant';

export class CreateReviewInDto {
  @ApiProperty({ example: 5, description: 'rating for product (1–5)' })
  @IsNotEmpty({ message: INVALID_REQUIRED })
  @IsNumber({}, { message: INVALID_NUMBER })
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'This is great', description: 'comment for product' })
  @IsNotEmpty({ message: INVALID_REQUIRED })
  @IsString({ message: INVALID_STRING })
  comment: string;
}
