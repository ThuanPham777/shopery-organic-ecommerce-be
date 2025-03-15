import { IsOptional, IsString } from 'class-validator';

export class updateTagDto {
  @IsOptional()
  @IsString()
  name?: string;
}
