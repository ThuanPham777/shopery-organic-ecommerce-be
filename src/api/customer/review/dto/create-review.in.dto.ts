import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, Max, IsString } from 'class-validator';

export class CreateReviewInDto {
  @ApiProperty({ example: 5, description: 'rating for product (1–5)' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'This is great', description: 'comment for product' })
  @IsNotEmpty()
  @IsString()
  comment: string;
}
