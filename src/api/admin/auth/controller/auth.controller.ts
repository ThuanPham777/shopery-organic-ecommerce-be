import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';
import { AuthAdminService } from '../service/auth.service';

@ApiTags('Admin / Auth')
@Controller('admin/auth')
export class AuthController {
  constructor(private authAdmin: AuthAdminService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authAdmin.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authAdmin.login(user);
  }
}
