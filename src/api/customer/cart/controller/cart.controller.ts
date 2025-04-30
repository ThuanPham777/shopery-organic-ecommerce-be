import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CartService } from '../service/cart.service';
import { CartItemDto } from '../dto/cart-item.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCart(
    @Query('userId') userId?: number,
    @Query('sessionId') sessionId?: string,
  ) {
    return this.cartService.getCart(userId, sessionId);
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async updateCartItem(
    @Param('cartItemId') cartItemId: number,
    @Body('quantity') quantity: number,
    @Query('sessionId') sessionId: string,
  ) {
    return this.cartService.updateCartItem(cartItemId, quantity, sessionId);
  }

  @Delete('remove/:cartItemId')
  @UseGuards(JwtAuthGuard)
  async removeCartItem(
    @Param('cartItemId') cartItemId: number,
    @Query('sessionId') sessionId: string,
  ) {
    return this.cartService.removeCartItem(cartItemId, sessionId);
  }

  @Delete('clear')
  @UseGuards(JwtAuthGuard)
  async clearCart(
    @Query('userId') userId: number,
    @Query('sessionId') sessionId: string,
  ) {
    return this.cartService.clearCart(userId, sessionId);
  }

  @Post('merge')
  @UseGuards(JwtAuthGuard)
  async mergeCart(
    @Query('userId') userId: number,
    @Query('sessionId') sessionId: string,
  ) {
    return this.cartService.mergeCart(userId, sessionId);
  }
}
