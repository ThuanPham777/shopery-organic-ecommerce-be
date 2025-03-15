import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class createCategoryDto{
    @IsNotEmpty({ message: 'name is required' })
      @IsString()
      name: string;

      @IsNotEmpty({ message: 'slug is required' })
      @IsString()
      slug: string;

      @IsNotEmpty({ message: 'description is required' })
      @IsString()
      description: string;

      @IsOptional()
      @IsString()
      image?: string;
}