import { IsNotEmpty, IsString } from 'class-validator';

export class createBrandDto {
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;
}
