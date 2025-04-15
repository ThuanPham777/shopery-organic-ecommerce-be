import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { CartService } from '../service/cart.service';
import { CartItemDto } from '../dto/cart-item.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(
    @Query('userId') userId?: number,
    @Query('sessionId') sessionId?: string,
  ) {
    return this.cartService.getCart(userId, sessionId);
  }

  @Post('add')
  async addToCart(
    @Body() cartItemDto: CartItemDto,
    @Query('userId') userId?: string,
    @Query('sessionId') sessionId?: string,
  ) {
    return this.cartService.addToCart(
      userId ? Number(userId) : null,
      sessionId || null,
      cartItemDto,
    );
  }

  @Patch('update/:cartItemId')
  async updateCartItem(
    @Param('cartItemId') cartItemId: number,
    @Body('quantity') quantity: number,
    @Query('sessionId') sessionId: string,
  ) {
    return this.cartService.updateCartItem(cartItemId, quantity, sessionId);
  }

  @Delete('remove/:cartItemId')
  async removeCartItem(
    @Param('cartItemId') cartItemId: number,
    @Query('sessionId') sessionId: string,
  ) {
    return this.cartService.removeCartItem(cartItemId, sessionId);
  }

  @Delete('clear')
  async clearCart(
    @Query('userId') userId: number,
    @Query('sessionId') sessionId: string,
  ) {
    return this.cartService.clearCart(userId, sessionId);
  }

  @Post('merge')
  async mergeCart(
    @Query('userId') userId: number,
    @Query('sessionId') sessionId: string,
  ) {
    return this.cartService.mergeCart(userId, sessionId);
  }
}
