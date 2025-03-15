import { IsOptional, IsString } from 'class-validator';

export class updateManufacturerDto {
  @IsOptional()
  @IsString()
  name: string;
}
