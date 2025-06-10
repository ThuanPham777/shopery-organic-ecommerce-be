// src/review/dto/update-review.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, Max, IsString } from 'class-validator';
import { INVALID_NUMBER, INVALID_REQUIRED, INVALID_STRING } from 'src/contants/invalid.constant';

export class UpdateReviewInDto {
  @ApiPropertyOptional({ example: 4, description: 'new rating (1–5)' })
  @IsOptional({ message: INVALID_REQUIRED })
  @IsNumber({}, { message: INVALID_NUMBER })
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({
    example: 'Updated comment',
    description: 'new comment text',
  })
  @IsOptional({ message: INVALID_REQUIRED })
  @IsString({ message: INVALID_STRING })
  comment?: string;
}
