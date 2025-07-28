import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './../../../database/entities/wishlist/wishlist.entity';
import { User } from 'src/database/entities/user/user.entity';
import { Product } from 'src/database/entities/product/product.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Thêm sản phẩm vào wishlist
  async add(userId: number, productId: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!user || !product)
      throw new NotFoundException('User or product not found');

    const exists = await this.wishlistRepository.findOneBy({
      user: { id: userId },
      product: { id: productId },
    });
    if (!exists) {
      const wish = this.wishlistRepository.create({ user, product });
      await this.wishlistRepository.save(wish);
    }
  }

  // Merge local wishlist vào tài khoản sau khi đăng nhập
  async merge(userId: number, localProductIds: number[]): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const existing = await this.wishlistRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });

    const existingProductIds = new Set(existing.map((w) => w.product.id));
    const newProductIds = localProductIds.filter(
      (id) => !existingProductIds.has(id),
    );

    const newProducts = await this.productRepository.findByIds(newProductIds);

    const newWishlists = newProducts.map((product) =>
      this.wishlistRepository.create({ user, product }),
    );

    await this.wishlistRepository.save(newWishlists);
  }

  // Lấy danh sách wishlist
  async getByUser(userId: number): Promise<Product[]> {
    const items = await this.wishlistRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });

    return items.map((w) => w.product);
  }

  // Xoá một sản phẩm khỏi wishlist
  async remove(userId: number, productId: number): Promise<void> {
    await this.wishlistRepository.delete({
      user: { id: userId },
      product: { id: productId },
    });
  }
}
