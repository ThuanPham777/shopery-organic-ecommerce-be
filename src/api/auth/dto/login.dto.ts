import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user123',
    description: 'Tên người dùng (bắt buộc có chữ, không chứa khoảng trắng)',
  })
  @IsString({ message: 'Tên người dùng phải là chuỗi' })
  @Matches(/^(?=.*[a-zA-Z])[^\s]+$/, {
    message:
      'Tên người dùng phải có ít nhất một chữ cái và không được chứa khoảng trắng',
  })
  username: string;

  @ApiProperty({
    example: '123456789',
    description: 'Mật khẩu của người dùng',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  password: string;
}
