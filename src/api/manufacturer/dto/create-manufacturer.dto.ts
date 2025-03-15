import { IsNotEmpty, IsString } from 'class-validator';

export class createManufacturerDto {
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;
}
