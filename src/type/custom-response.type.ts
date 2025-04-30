import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { DEFAULT_PER_PAGE } from 'src/contants/common.constant';
import { INVALID_NUMBER } from 'src/contants/invalid.constant';

export class ApiError<T = any> {
  message: string;
  error?: T;
}

export class ApiRes<T = any> {
  constructor(data: T, message?: string) {
    this.data = data;
    this.message = message;
  }
  @ApiProperty({ type: Object })
  data: T;

  @ApiProperty({ type: String, nullable: true })
  message?: string;
}

export class ApiLisRes<T = any> {
  constructor(data: T[], message?: string) {
    this.data = data;
    this.message = message;
  }
  @ApiProperty({ type: Object })
  data: T[];

  @ApiProperty({ type: String, nullable: true })
  message?: string;
}

export class ApiNullableRes<T = any> {
  constructor(data: T, message?: string) {
    this.data = data;
    this.message = message;
  }
  @ApiProperty({ type: Object })
  data?: T | null;

  @ApiProperty({ type: String, nullable: true })
  message?: string;
}

export class Pagination {
  @ApiProperty({ type: Number })
  page: number; // current page
  @ApiProperty({ type: Number })
  perPage: number; // max count in page
  @ApiProperty({ type: Number })
  totalPage: number;
  @ApiProperty({ type: Number, nullable: true })
  nextPage?: number;
  @ApiProperty({ type: Number, nullable: true })
  prevPage?: number;
  @ApiProperty({ type: Number })
  total: number; // total of items
  @ApiProperty({ type: Number })
  count: number; // length of data
}

export class ApiPag<T = any> {
  @ApiProperty({ type: Object, isArray: true }) // có thể custom thêm schema chi tiết
  items: T[];

  @ApiProperty({ type: Pagination })
  pagination: Pagination;
}

export class ApiPagRes<T = any> {
  @ApiProperty({ type: String })
  message: string;

  @ApiProperty({ type: () => ApiPag })
  data: ApiPag<T>;
  constructor(
    items: T[],
    totalCount: number,
    page = DEFAULT_PER_PAGE,
    perPage?: number,
    message: string = 'Lấy dữ liệu thành công',
  ) {
    page = Number(page) || 1;
    perPage = Number(perPage);

    const currPage = Number(page);
    const totalPage = perPage ? Math.ceil(totalCount / perPage) : 1;
    const prevPage = currPage > 1 ? currPage - 1 : undefined;
    const nextPage = currPage < totalPage ? currPage + 1 : undefined;

    this.message = message;
    this.data = {
      items,
      pagination: {
        page,
        perPage,
        count: items.length,
        totalPage,
        total: totalCount,
        prevPage,
        nextPage,
      },
    };

    // this.pagination = {
    //   page,
    //   perPage,
    //   count: items.length,
    //   totalPage,
    //   total: totalCount,
    //   prevPage,
    //   nextPage,
    // };
    // this.data = items;
  }

  // data: T[];

  // @ApiProperty({ type: Pagination })
  // pagination: Pagination;
}

export class ApiPagReq {
  @ApiProperty({ type: 'number', nullable: true, required: false, default: 1 })
  @Type(() => Number)
  @IsNumber({}, { message: INVALID_NUMBER })
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiProperty({
    type: 'number',
    nullable: true,
    required: false,
    default: DEFAULT_PER_PAGE,
  })
  @Type(() => Number)
  @IsNumber({}, { message: INVALID_NUMBER })
  @Min(1)
  @IsOptional()
  perPage?: number;

  @ApiProperty({
    type: 'string',
    isArray: true,
    nullable: true,
    required: false,
  })
  @IsOptional()
  sorts?: `${string}|${'asc' | 'desc'}`[];
}
