// src/review/dto/update-review.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, Max, IsString } from 'class-validator';

export class UpdateReview {
  @ApiPropertyOptional({ example: 4, description: 'new rating (1–5)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({
    example: 'Updated comment',
    description: 'new comment text',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
