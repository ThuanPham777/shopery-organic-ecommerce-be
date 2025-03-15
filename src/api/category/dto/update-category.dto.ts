import {IsOptional, IsString } from "class-validator";

export class updateCategoryDto{
    @IsOptional()
      @IsString()
      name?: string;

      @IsOptional()
      @IsString()
      slug?: string;

      @IsOptional()
      @IsString()
      description?: string;

      @IsOptional()
      @IsString()
      image?: string;
}