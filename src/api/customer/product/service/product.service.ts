// product/product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThanOrEqual, MoreThanOrEqual, Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from '../../../../database/entities/product/product.entity';
import { GetAllProductsInDto } from '../dto/get-all-products.in.dto';
import { DEFAULT_PER_PAGE } from 'src/contants/common.constant';
import { Review } from 'src/database/entities/review/review.entity';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }

  // Method to fetch all products
  async getAllProducts(
    query: GetAllProductsInDto,
  ): Promise<{ products: Product[]; total: number }> {
    const {
      page = 1,
      perPage = DEFAULT_PER_PAGE,
      category,
      manufacturer,
      brand,
      tag,
      minPrice,
      maxPrice,
      sorts = [],
    } = query;

    const [products, total] = await this.productRepository.findAndCount({
      where: {
        deleted_at: IsNull(),
        ...(minPrice && { price: MoreThanOrEqual(minPrice) }),
        ...(maxPrice && { price: LessThanOrEqual(maxPrice) }),
        ...(category && { category: { slug: category, deleted_at: IsNull() } }),
        ...(manufacturer && { manufacturer: { name: manufacturer, deleted_at: IsNull() } }),
        ...(brand && { brand: { name: brand, deleted_at: IsNull() } }),
        ...(tag && { tags: { name: tag, deleted_at: IsNull() } }),
      },
      relations: ['category', 'manufacturer', 'brand', 'tags', 'images'],
      order: sorts.length ? Object.fromEntries(sorts.map(s => s.split('|'))) : { created_at: 'DESC' },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return { products, total };
  }

  // Method fetch product by id
  async getProductById(productId: number): Promise<Product> {
    // Fetch the product along with its nested relations.
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: [
        'category',
        'manufacturer',
        'brand',
        'tags',
        'images',
        'reviews',
        'reviews.user', // This loads the user data for each review.
      ],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Map the product fields and transform related objects.
    return product;
  }
}
