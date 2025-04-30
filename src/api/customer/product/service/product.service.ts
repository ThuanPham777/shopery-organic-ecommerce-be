// product/product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../../database/entities/product/product.entity';
import { GetAllProducts } from '../dto/get-all-products.dto.';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  private readonly sortableFields = [
    'name',
    'price',
    'created_at',
    'modified_at',
    'sold',
    'quantity',
  ];
  // Method to fetch all products
  async getProducts(
    query: GetAllProducts,
  ): Promise<{ products: any[]; total: number }> {
    const {
      page = 1,
      perPage = 10,
      category,
      manufacturer,
      brand,
      tag,
      minPrice,
      maxPrice,
      rating,
      keyword,
      sorts = [],
    } = query;
    const skip = (page - 1) * perPage;
    const take = perPage;

    // Build base query for count
    let qb = this.productRepository
      .createQueryBuilder('product')
      .andWhere('product.deleted_at IS NULL');

    // Conditional joins only if needed for filters
    if (category) {
      qb = qb.leftJoin(
        'product.category',
        'category',
        'category.deleted_at IS NULL',
      );
      qb = qb.andWhere('category.slug = :category', { category });
    }
    if (manufacturer) {
      qb = qb.leftJoin(
        'product.manufacturer',
        'manufacturer',
        'manufacturer.deleted_at IS NULL',
      );
      qb = qb.andWhere('manufacturer.name = :manufacturer', { manufacturer });
    }
    if (brand) {
      qb = qb.leftJoin('product.brand', 'brand', 'brand.deleted_at IS NULL');
      qb = qb.andWhere('brand.name = :brand', { brand });
    }
    if (tag) {
      qb = qb.leftJoin('product.tags', 'tag', 'tag.deleted_at IS NULL');
      qb = qb.andWhere('tag.name = :tag', { tag });
    }
    if (minPrice) {
      qb = qb.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (maxPrice) {
      qb = qb.andWhere('product.price <= :maxPrice', { maxPrice });
    }
    if (rating) {
      qb = qb.andWhere(
        (subQb) => {
          const subQuery = subQb
            .subQuery()
            .select('COALESCE(AVG(review.rating), 0)')
            .from('Review', 'review')
            .where('review.product_id = product.id')
            .getQuery();
          return `${subQuery} >= :rating`;
        },
        { rating },
      );
    }
    if (keyword) {
      qb = qb.andWhere('product.name LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    // Get total count
    const total = await qb.getCount();

    // Build data query with all relations
    let dataQb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect(
        'product.category',
        'category',
        'category.deleted_at IS NULL',
      )
      .leftJoinAndSelect(
        'product.manufacturer',
        'manufacturer',
        'manufacturer.deleted_at IS NULL',
      )
      .leftJoinAndSelect('product.brand', 'brand', 'brand.deleted_at IS NULL')
      .leftJoinAndSelect('product.tags', 'tags', 'tags.deleted_at IS NULL')
      .leftJoinAndSelect('product.images', 'images')
      .andWhere('product.deleted_at IS NULL');

    // Apply the same filters
    if (category) {
      dataQb = dataQb.andWhere('category.slug = :category', { category });
    }
    if (manufacturer) {
      dataQb = dataQb.andWhere('manufacturer.name = :manufacturer', {
        manufacturer,
      });
    }
    if (brand) {
      dataQb = dataQb.andWhere('brand.name = :brand', { brand });
    }
    if (tag) {
      dataQb = dataQb.andWhere('tags.name = :tag', { tag });
    }
    if (minPrice) {
      dataQb = dataQb.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (maxPrice) {
      dataQb = dataQb.andWhere('product.price <= :maxPrice', { maxPrice });
    }
    if (rating) {
      dataQb = dataQb.andWhere(
        (subQb) => {
          const subQuery = subQb
            .subQuery()
            .select('COALESCE(AVG(review.rating), 0)')
            .from('Review', 'review')
            .where('review.product_id = product.id')
            .getQuery();
          return `${subQuery} >= :rating`;
        },
        { rating },
      );
    }
    if (keyword) {
      dataQb = dataQb.andWhere('product.name LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    // Apply sorting
    if (sorts.length > 0) {
      sorts.forEach((sort) => {
        const [field, order] = sort.split('|');
        if (
          this.sortableFields.includes(field) &&
          (order === 'asc' || order === 'desc')
        ) {
          dataQb = dataQb.addOrderBy(
            `product.${field}`,
            order.toUpperCase() as 'ASC' | 'DESC',
          );
        }
      });
    } else {
      dataQb = dataQb.orderBy('product.created_at', 'DESC');
    }

    // Apply pagination
    dataQb = dataQb.skip(skip).take(take);

    // Fetch entities
    const products = await dataQb.getMany();

    // Map to desired format
    const data = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      thumbnail: product.thumbnail,
      sku: product.sku,
      price: product.price,
      status: product.status,
      quantity: product.quantity,
      sold: product.sold,
      featured: product.featured,
      discount: product.discount,
      category: product.category?.name ?? '',
      manufacturer: product.manufacturer?.name ?? '',
      brand: product.brand?.name ?? '',
      tags: product.tags.map((tag) => tag.name),
      images: product.images.map((image) => image.image_url),
      created_at: product.created_at,
      modified_at: product.modified_at,
      deleted_at: product.deleted_at,
    }));

    return { products: data, total };
  }

  // Method fetch product by id
  async getProduct(productId: number) {
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
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      thumbnail: product.thumbnail,
      sku: product.sku,
      price: product.price,
      status: product.status,
      quantity: product.quantity,
      sold: product.sold,
      featured: product.featured,
      discount: product.discount,
      category: product.category ? product.category.name : null,
      manufacturer: product.manufacturer ? product.manufacturer.name : null,
      brand: product.brand ? product.brand.name : null,
      tags: product.tags ? product.tags.map((t) => t.name) : [],
      images: product.images ? product.images.map((pi) => pi.image_url) : [],
      reviews: product.reviews
        ? product.reviews.map((review) => ({
            id: review.id,
            rating: review.rating,
            comment: review.comment,
            created_at: review.created_at,
            // Map user details from the review.
            user: review.user
              ? {
                  username: review.user.username,
                  avatar_url: review.user.avatar_url,
                }
              : null,
          }))
        : [],
      created_at: product.created_at,
      modified_at: product.modified_at,
      deleted_at: product.deleted_at,
    };
  }
}
