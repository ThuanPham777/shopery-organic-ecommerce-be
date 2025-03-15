import { IsNotEmpty, IsString } from 'class-validator';

export class createTagDto {
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;
}
