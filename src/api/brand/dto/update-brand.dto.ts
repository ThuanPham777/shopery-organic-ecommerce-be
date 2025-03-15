import { IsNotEmpty, IsString } from 'class-validator';

export class updateBrandDto {
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;
}
