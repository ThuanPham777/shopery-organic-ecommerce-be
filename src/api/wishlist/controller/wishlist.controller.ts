import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from '../service/wishlist.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { EUserRole } from 'src/enums/user.enums';
import { Roles } from 'src/api/auth/decorators/roles.decorator';
import { AddToWishlistDto } from '../dto/add-to-wishlist.dto';

@ApiTags('Wishlist')
@Controller('wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('add')
  @Roles(EUserRole.USER)
  add(@Req() req, @Body('productId') productId: number) {
    return this.wishlistService.add(req.user.id, productId);
  }

  @Get()
  @Roles(EUserRole.USER)
  get(@Req() req) {
    return this.wishlistService.getByUser(req.user.id);
  }

  @Delete(':productId')
  @Roles(EUserRole.USER)
  remove(@Req() req, @Param('productId') productId: number) {
    return this.wishlistService.remove(req.user.id, +productId);
  }

  // Merge wishlist khi đăng nhập (gửi từ frontend localStorage)
  @Post('merge')
  @Roles(EUserRole.USER)
  merge(@Req() req, @Body() body: AddToWishlistDto) {
    return this.wishlistService.merge(req.user.id, body.productIds);
  }
}
