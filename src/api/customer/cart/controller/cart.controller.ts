import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { CartService } from '../service/cart.service';
import { AddCartItemInDto } from '../dto/add-cart-item.in.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiNullableRes, ApiRes } from 'src/type/custom-response.type';
import { UpdateCartItemInDto } from '../dto/update-cart-item.in.dto';

// Define custom session type
type SessionWithUser = {
  userId?: number;
  id: string;
};

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Get()
  async getCart(
    @Req() req: Request & { session: SessionWithUser },
  ) {
    const userId = req.session.userId;
    const sessionId = userId ? undefined : req.session.id;
    const cart = await this.cartService.getCart(userId, sessionId);
    return new ApiRes(cart, 'Get cart successfully');
  }

  @Post()
  async addToCart(
    @Body() addCartItemDto: AddCartItemInDto,
    @Req() req: Request & { session: SessionWithUser },
  ) {
    const userId = req.session.userId;
    const sessionId = userId ? undefined : req.session.id;
    const result = await this.cartService.addToCart(
      userId ?? null,
      sessionId ?? null,
      addCartItemDto
    );
    return new ApiRes(result, 'Item added to cart');
  }

  @Patch(':cartItemId')
  async updateCartItem(
    @Param('cartItemId') cartItemId: number,
    @Body() updateCartItemDto: UpdateCartItemInDto,
    @Req() req: Request & { session: SessionWithUser },
  ) {
    const userId = req.session.userId;
    const sessionId = userId ? undefined : req.session.id;
    const result = await this.cartService.updateCartItem(
      cartItemId,
      updateCartItemDto,
      sessionId
    );
    return new ApiRes(result, 'Cart item updated');
  }

  @Delete(':cartItemId')
  async removeCartItem(
    @Param('cartItemId') cartItemId: number,
    @Req() req: Request & { session: SessionWithUser },
  ) {
    const userId = req.session.userId;
    const sessionId = userId ? undefined : req.session.id;
    const result = await this.cartService.removeCartItem(
      cartItemId,
      sessionId
    );
    return new ApiRes(result, 'Item removed from cart');
  }

  @Delete('clear')
  async clearCart(
    @Req() req: Request & { session: SessionWithUser },
  ) {
    const userId = req.session.userId;
    const sessionId = userId ? undefined : req.session.id;
    const result = await this.cartService.clearCart(userId, sessionId);
    return new ApiRes(result, 'Cart cleared successfully');
  }

  @Post('merge')
  async mergeCart(
    @Req() req: Request & { session: SessionWithUser },
  ) {
    const userId = req.session.userId;
    if (!userId) throw new UnauthorizedException('User must be logged in');
    const sessionId = req.session.id;
    await this.cartService.mergeCart(userId, sessionId);
    return new ApiNullableRes(null, 'Cart merged successfully');
  }
}
