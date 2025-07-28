import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/database/entities/category/category.entity';
import { ApiPag, ApiPagRes } from 'src/type/custom-response.type';

export class GetAllCategoriesOutDto {
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
  product_count: number;

  @ApiProperty({ type: Date })
  created_at: Date;

  @ApiProperty({ type: Date })
  modified_at: Date;

  @ApiProperty({ type: Date })
  deleted_at: Date;
}

export class GetAllCategoriesPagDto extends ApiPag {
  @ApiProperty({ type: GetAllCategoriesOutDto, isArray: true })
  declare items: GetAllCategoriesOutDto[];
}

export class GetAllCategoriesOutRes extends ApiPagRes {
  @ApiProperty({ type: GetAllCategoriesPagDto })
  declare data: GetAllCategoriesPagDto;
}
