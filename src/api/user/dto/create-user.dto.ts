// src/user/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user123',
    description: 'Tên người dùng (bắt buộc có chữ, không chứa khoảng trắng)',
  })
  @IsString({ message: 'Tên người dùng phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên người dùng không được để trống' })
  @Matches(/^(?=.*[a-zA-Z])[^\s]+$/, {
    message:
      'Tên người dùng phải có ít nhất một chữ cái và không được chứa khoảng trắng',
  })
  username: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email của người dùng',
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Mật khẩu của người dùng',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  password: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Xác nhận mật khẩu của người dùng',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Mật khẩu xác nhận phải có ít nhất 8 ký tự' })
  confirmPassword: string;
}
