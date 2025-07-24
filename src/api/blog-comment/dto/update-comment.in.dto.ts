import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Min, Max, IsString } from 'class-validator';
import { INVALID_REQUIRED, INVALID_STRING } from 'src/contants/invalid.constant';

export class UpdateCommentInDto {
  @ApiPropertyOptional({
    example: 'Updated comment',
    description: 'new comment text',
  })
  @IsOptional({ message: INVALID_REQUIRED })
  @IsString({ message: INVALID_STRING })
  content?: string;
}
