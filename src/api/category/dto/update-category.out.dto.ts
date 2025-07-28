import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryOutDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  slug: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: String })
  image: string;

  @ApiProperty({ type: Number })
  parentId: number;

  @ApiProperty({ type: Date })
  created_at: Date;

  @ApiProperty({ type: Date })
  modified_at: Date;
}
