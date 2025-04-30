import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UNAUTHORIZED } from 'src/contants/error.contant';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (info && info.message === 'No auth token') {
      throw new UnauthorizedException(UNAUTHORIZED);
    }

    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException(UNAUTHORIZED);
    }

    //  // Kiểm tra nếu người dùng không có quyền truy cập vào tài nguyên
    //  if (!user) {
    //    throw new ForbiddenException(FORBIDDEN_EXCEPTION);
    //  }

    return super.handleRequest(err, user, info, context, status);
  }
}
