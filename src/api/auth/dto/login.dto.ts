import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user123 or user@example.com',
    description: 'Username or Email'
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: '123456789',
    description: 'Password',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;
}
