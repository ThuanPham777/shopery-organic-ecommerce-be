import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/database/entities/cart/cart-item.entity';
import { Cart } from 'src/database/entities/cart/cart.entity';
import { RedisService } from 'src/redis/redis.service';
import { Repository } from 'typeorm';
import { AddCartItemInDto } from '../dto/add-cart-item.in.dto';
import { UpdateCartItemInDto } from '../dto/update-cart-item.in.dto';

@Injectable()
export class CartService {
  private readonly REDIS_CART_PREFIX = 'cart:';
  private readonly REDIS_CART_TTL = 3600; // 1 hour

  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private readonly redisService: RedisService,
  ) { }

  // Lấy giỏ hàng theo user (database) hoặc sessionId (Redis cho khách)
  async getCart(userId?: number, sessionId?: string): Promise<Cart> {
    if (userId) {
      return this.getUserCart(userId);
    }

    if (sessionId) {
      return this.getGuestCart(sessionId);
    }

    throw new NotFoundException('Cart not found');
  }

  private async getUserCart(userId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  }

  private async getGuestCart(sessionId: string): Promise<Cart> {
    const cartItems = await this.redisService.get<AddCartItemInDto[]>(
      this.getRedisCartKey(sessionId)
    );

    if (!cartItems) {
      throw new NotFoundException('Cart not found');
    }

    return {
      id: null,
      items: cartItems.map(item => ({
        id: null,
        quantity: item.quantity,
        product: { id: item.product_id },
        cart: null
      })),
      total: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    } as unknown as Cart;
  }

  // Thêm sản phẩm vào giỏ hàng
  async addToCart(
    userId: number | null,
    sessionId: string | null,
    addCartItemDto: AddCartItemInDto,
  ): Promise<Cart> {
    if (!userId && sessionId) {
      return this.addToGuestCart(sessionId, addCartItemDto);
    }

    return this.addToUserCart(userId!, addCartItemDto);
  }

  private async addToGuestCart(sessionId: string, addCartItemDto: AddCartItemInDto): Promise<Cart> {
    let cartItems = await this.redisService.get<AddCartItemInDto[]>(
      this.getRedisCartKey(sessionId)
    ) || [];

    const existingItemIndex = cartItems.findIndex(
      item => item.product_id === addCartItemDto.product_id
    );

    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].quantity += addCartItemDto.quantity;
    } else {
      cartItems.push(addCartItemDto);
    }

    await this.redisService.set(
      this.getRedisCartKey(sessionId),
      cartItems,
      this.REDIS_CART_TTL
    );

    return this.getGuestCart(sessionId);
  }

  private async addToUserCart(userId: number, addCartItemDto: AddCartItemInDto): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ user: { id: userId } });
      await this.cartRepository.save(cart);
    }

    const existingItem = cart.items.find(
      item => item.product.id === addCartItemDto.product_id
    );

    if (existingItem) {
      existingItem.quantity += addCartItemDto.quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      const newItem = this.cartItemRepository.create({
        cart,
        quantity: addCartItemDto.quantity,
        product: { id: addCartItemDto.product_id },
      });
      await this.cartItemRepository.save(newItem);
    }

    return this.getUserCart(userId);
  }

  // Cập nhật số lượng sản phẩm
  async updateCartItem(
    cartItemId: number,
    updateCartItemDto: UpdateCartItemInDto,
    sessionId?: string,
  ): Promise<Cart> {
    if (sessionId) {
      return this.updateGuestCartItem(cartItemId, updateCartItemDto, sessionId);
    }

    return this.updateUserCartItem(cartItemId, updateCartItemDto);
  }

  private async updateGuestCartItem(
    cartItemId: number,
    updateCartItemDto: UpdateCartItemInDto,
    sessionId: string,
  ): Promise<Cart> {
    let cartItems = await this.redisService.get<AddCartItemInDto[]>(
      this.getRedisCartKey(sessionId)
    );

    if (!cartItems) throw new NotFoundException('Cart not found');

    const itemIndex = cartItems.findIndex(
      item => item.product_id === cartItemId
    );

    if (itemIndex === -1) throw new NotFoundException('CartItem not found');

    cartItems[itemIndex].quantity = updateCartItemDto.quantity;
    await this.redisService.set(
      this.getRedisCartKey(sessionId),
      cartItems,
      this.REDIS_CART_TTL
    );

    return this.getGuestCart(sessionId);
  }

  private async updateUserCartItem(
    cartItemId: number,
    updateCartItemDto: UpdateCartItemInDto,
  ): Promise<Cart> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
      relations: ['cart', 'cart.user'],
    });

    if (!cartItem) throw new NotFoundException('CartItem not found');

    cartItem.quantity = updateCartItemDto.quantity;
    await this.cartItemRepository.save(cartItem);

    return this.getUserCart(cartItem.cart.user.id);
  }

  // Xóa sản phẩm khỏi giỏ hàng
  async removeCartItem(cartItemId: number, sessionId?: string): Promise<Cart> {
    if (sessionId) {
      return this.removeGuestCartItem(cartItemId, sessionId);
    }

    return this.removeUserCartItem(cartItemId);
  }

  private async removeGuestCartItem(cartItemId: number, sessionId: string): Promise<Cart> {
    let cartItems = await this.redisService.get<AddCartItemInDto[]>(
      this.getRedisCartKey(sessionId)
    );

    if (!cartItems) throw new NotFoundException('Cart not found');

    cartItems = cartItems.filter(item => item.product_id !== cartItemId);
    await this.redisService.set(
      this.getRedisCartKey(sessionId),
      cartItems,
      this.REDIS_CART_TTL
    );

    return this.getGuestCart(sessionId);
  }

  private async removeUserCartItem(cartItemId: number): Promise<Cart> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
      relations: ['cart', 'cart.user'],
    });

    if (!cartItem) throw new NotFoundException('CartItem not found');

    await this.cartItemRepository.remove(cartItem);
    return this.getUserCart(cartItem.cart.user.id);
  }

  // Xóa toàn bộ giỏ hàng
  async clearCart(userId?: number, sessionId?: string): Promise<Cart> {
    if (sessionId) {
      await this.redisService.del(this.getRedisCartKey(sessionId));
      return this.getGuestCart(sessionId);
    }

    if (userId) {
      const cart = await this.cartRepository.findOne({
        where: { user: { id: userId } },
        relations: ['items'],
      });

      if (!cart) throw new NotFoundException('Cart not found');

      await this.cartItemRepository.remove(cart.items);
      return this.getUserCart(userId);
    }

    throw new NotFoundException('Cart not found');
  }

  // Merge giỏ hàng khi đăng nhập
  async mergeCart(userId: number, sessionId: string) {
    const redisCartItems = await this.redisService.get<AddCartItemInDto[]>(
      this.getRedisCartKey(sessionId)
    );

    if (!redisCartItems) return;

    // Thêm tất cả items từ Redis vào database
    for (const item of redisCartItems) {
      await this.addToUserCart(userId, item);
    }

    // Xóa giỏ hàng tạm trong Redis
    await this.redisService.del(this.getRedisCartKey(sessionId));
  }

  private getRedisCartKey(sessionId: string): string {
    return `${this.REDIS_CART_PREFIX}${sessionId}`;
  }
}