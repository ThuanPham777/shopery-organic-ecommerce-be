import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/database/entities/cart/cart-item.entity';
import { Cart } from 'src/database/entities/cart/cart.entity';
import { RedisService } from 'src/redis/redis.service';
import { Repository } from 'typeorm';
import { CartItemDto } from '../dto/cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private readonly redisService: RedisService,
  ) {}

  //Lấy giỏ hàng theo user hoặc sessionId (cho khách)
  async getCart(userId?: number, sessionId?: string) {
    if (userId) {
      return await this.cartRepository.findOne({
        where: { user: { id: userId } },
        relations: ['items', 'items.product'],
      });
    }
    if (sessionId) {
      return (await this.redisService.get(`cart:${sessionId}`)) || [];
    }
    throw new NotFoundException('Cart not found');
  }

  //Thêm sản phẩm vào giỏ hàng
  async addToCart(
    userId: number | null,
    sessionId: string | null,
    cartItemDto: CartItemDto,
  ) {
    // Chưa đăng nhập
    if (!userId && sessionId) {
      let cartItems = await this.redisService.get<CartItemDto[]>(
        `cart:${sessionId}`,
      );
      if (!cartItems) cartItems = [];
      cartItems.push(cartItemDto);
      await this.redisService.set(`cart:${sessionId}`, cartItems, 3600);
      return { message: 'CartItem saved in Redis' };
    }

    // đã đăng nhập
    let cart = await this.cartRepository.findOne({
      where: userId ? { user: { id: userId } } : {}, // Nếu userId null, truyền {}
      relations: ['items'],
    });

    if (!cart) {
      cart = this.cartRepository.create({
        user: { id: userId ?? undefined },
        total: 0,
      });

      await this.cartRepository.save(cart);
    }

    const existingItem = await this.cartItemRepository.findOne({
      where: { cart: { id: cart.id }, product: { id: cartItemDto.product_id } },
    });

    if (existingItem) {
      existingItem.quantity += cartItemDto.quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      const newItem = this.cartItemRepository.create({
        cart,
        quantity: cartItemDto.quantity,
        product: { id: cartItemDto.product_id },
      });
      await this.cartItemRepository.save(newItem);
    }

    return await this.getCart(userId ?? undefined);
  }

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  async updateCartItem(
    cartItemId: number | null,
    quantity: number,
    sessionId?: string,
  ) {
    // Nếu chưa đăng nhập, cập nhật trong Redis
    if (sessionId) {
      let cartItems = await this.redisService.get<CartItemDto[]>(
        `cart:${sessionId}`,
      );
      if (!cartItems) throw new NotFoundException('Cart not found');

      const itemIndex = cartItems.findIndex(
        (item) => item.product_id === cartItemId,
      );
      if (itemIndex === -1) throw new NotFoundException('CartItem not found');

      cartItems[itemIndex].quantity = quantity;
      await this.redisService.set(`cart:${sessionId}`, cartItems, 3600);
      return { message: 'CartItem updated in Redis' };
    }

    // Nếu đã đăng nhập, cập nhật trong DB
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId ?? undefined },
    });
    if (!cartItem) throw new NotFoundException('CartItem not found');

    cartItem.quantity = quantity;
    await this.cartItemRepository.save(cartItem);
    return cartItem;
  }

  // Xóa một sản phẩm khỏi giỏ hàng
  async removeCartItem(cartItemId: number, sessionId?: string) {
    // Nếu chưa đăng nhập, xóa trong Redis
    if (sessionId) {
      let cartItems = await this.redisService.get<CartItemDto[]>(
        `cart:${sessionId}`,
      );
      if (!cartItems) throw new NotFoundException('Cart not found');

      cartItems = cartItems.filter((item) => item.product_id !== cartItemId);
      await this.redisService.set(`cart:${sessionId}`, cartItems, 3600);
      return { message: 'CartItem removed from Redis' };
    }

    // Nếu đã đăng nhập, xóa trong database
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
    });
    if (!cartItem) throw new NotFoundException('CartItem not found');

    await this.cartItemRepository.remove(cartItem);
    return { message: 'CartItem removed' };
  }

  // Xóa toàn bộ giỏ hàng
  async clearCart(userId?: number, sessionId?: string) {
    // Nếu chưa đăng nhập, xóa giỏ hàng trong Redis
    if (sessionId) {
      await this.redisService.del(`cart:${sessionId}`);
      return { message: 'Cart cleared in Redis' };
    }

    // Nếu đã đăng nhập, xóa giỏ hàng trong database
    if (userId) {
      const cart = await this.cartRepository.findOne({
        where: { user: { id: userId } },
        relations: ['items'],
      });
      if (!cart) throw new NotFoundException('Cart not found');

      await this.cartItemRepository.remove(cart.items);
      return { message: 'Cart cleared in database' };
    }

    throw new NotFoundException('Cart not found');
  }

  // Merge giỏ hàng khách vào tài khoản user khi đăng nhập
  async mergeCart(userId: number, sessionId: string) {
    const redisCartItems = await this.redisService.get<CartItemDto[]>(
      `cart:${sessionId}`,
    );
    if (!redisCartItems) return;

    for (const item of redisCartItems) {
      await this.addToCart(userId, null, item);
    }

    await this.redisService.del(`cart:${sessionId}`);
  }
}
