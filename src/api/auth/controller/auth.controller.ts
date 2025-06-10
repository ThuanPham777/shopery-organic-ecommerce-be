import { Body, Controller, Post, Req, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dto/login.dto';
import { SignupDto } from '../dto/signup.dto';
import { SUCCESS } from 'src/contants/response.constant';
import { ApiRes } from 'src/type/custom-response.type';
import { LoginResponse } from 'src/type/auth.types';
import { Request } from 'express';
import { CartService } from 'src/api/cart/service/cart.service';

// Define custom session type
type SessionWithUser = {
  userId?: number;
  id: string;
};

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly cartService: CartService) { }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const user = await this.authService.signup(signupDto);
    return new ApiRes(user, SUCCESS);
  }

  @Post('login')
  async login(
    @Req() req: Request & { session: SessionWithUser },
    @Body() loginDto: LoginDto
  ): Promise<ApiRes<LoginResponse>> {
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);
    if (!user) throw new UnauthorizedException('username hoặc mật khẩu không đúng');

    const oldSessionId = req.session.id;

    // Regenerate session to prevent fixation
    await new Promise<void>((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) reject(err);
        resolve();
      });
    });

    req.session.userId = user.id;

    // Merge cart from old session if exists
    if (oldSessionId) {
      await this.cartService.mergeCart(user.id, oldSessionId);
    }

    const userLogin = await this.authService.login(user);
    return new ApiRes(userLogin, SUCCESS);
  }
}
