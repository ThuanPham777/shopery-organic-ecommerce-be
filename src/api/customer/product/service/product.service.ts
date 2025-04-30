// product/product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from '../../../../database/entities/product/product.entity';
import { Category } from '../../../../database/entities/category/category.entity';
import { Brand } from '../../../../database/entities/brand/brand.entity';
import { Manufacturer } from '../../../../database/entities/manufacturer/manufacturer.entity';
import { Tag } from '../../../../database/entities/tag/tag.entity';
import { ProductImages } from '../../../../database/entities/product/product-image.entity';
import { GetProductsDto } from '../dto/get-products.dto.';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  // Method to fetch all products
  async getProducts(query: GetProductsDto) {
    const {
      page = 1,
      category,
      manufacturer,
      brand,
      tag,
      sort,
      rating,
      minPrice,
      maxPrice,
    } = query;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Build the base query with custom SELECT.
    // then join and add only the related "name" fields,
    // and aggregate tags and productImages.
    let qb = this.productRepository
      .createQueryBuilder('product')
      .select([
        'product.id',
        'product.name',
        'product.slug',
        'product.description',
        'product.thumbnail',
        'product.sku',
        'product.price',
        'product.status',
        'product.quantity',
        'product.sold',
        'product.featured',
        'product.discount',
        'product.created_at',
        'product.modified_at',
        'product.deleted_at',
      ])
      .leftJoin('product.category', 'category')
      .addSelect('category.name', 'categoryName')
      .leftJoin('product.manufacturer', 'manufacturer')
      .addSelect('manufacturer.name', 'manufacturerName')
      .leftJoin('product.brand', 'brand')
      .addSelect('brand.name', 'brandName')
      .leftJoin('product.tags', 'tag')
      .addSelect('GROUP_CONCAT(DISTINCT tag.name)', 'tagNames')
      .leftJoin('product.images', 'productImage')
      .addSelect(
        'GROUP_CONCAT(DISTINCT productImage.image_url)',
        'productImageUrls',
      )
      .groupBy('product.id');

    // Add filtering conditions.
    if (category) {
      qb = qb.andWhere('category.name = :category', { category });
    }
    if (manufacturer) {
      qb = qb.andWhere('manufacturer.name = :manufacturer', { manufacturer });
    }
    if (brand) {
      qb = qb.andWhere('brand.name = :brand', { brand });
    }
    if (tag) {
      qb = qb.andWhere('tag.name = :tag', { tag });
    }
    if (minPrice !== undefined) {
      qb = qb.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      qb = qb.andWhere('product.price <= :maxPrice', { maxPrice });
    }
    if (rating) {
      // Use a subquery to compare average review rating.
      qb = qb.andWhere(
        (qb) => {
          const subQuery = qb
            .subQuery()
            .select('AVG(review.rating)')
            .from('Review', 'review')
            .where('review.product_id = product.id')
            .getQuery();
          return `${subQuery} >= :rating`;
        },
        { rating },
      );
    }

    // Sorting
    if (sort) {
      switch (sort) {
        case 'price_asc':
          qb = qb.orderBy('product.price', 'ASC');
          break;
        case 'price_desc':
          qb = qb.orderBy('product.price', 'DESC');
          break;
        case 'name_asc':
          qb = qb.orderBy('product.name', 'ASC');
          break;
        case 'name_desc':
          qb = qb.orderBy('product.name', 'DESC');
          break;
        case 'latest':
          qb = qb.orderBy('product.created_at', 'DESC');
          break;
        case 'oldest':
          qb = qb.orderBy('product.created_at', 'ASC');
          break;
        default:
          qb = qb.orderBy('product.created_at', 'DESC');
          break;
      }
    }

    qb = qb.offset(skip).limit(limit);

    // Use getRawAndEntities to get both raw results and entities.
    // We'll mainly work with the raw result for our custom selections.
    const { raw, entities } = await qb.getRawAndEntities();
    // Note: raw items have keys like product_id, categoryName, etc.

    // Map raw result into the desired shape.
    const data = raw.map((rawItem) => ({
      id: rawItem.product_id,
      name: rawItem.product_name,
      slug: rawItem.product_slug,
      description: rawItem.product_description,
      thumbnail: rawItem.product_thumbnail,
      sku: rawItem.product_sku,
      price: rawItem.product_price,
      status: rawItem.product_status,
      quantity: rawItem.product_quantity,
      sold: rawItem.product_sold,
      featured: rawItem.product_featured,
      discount: rawItem.product_discount,
      category: rawItem.categoryName,
      manufacturer: rawItem.manufacturerName,
      brand: rawItem.brandName,
      tags: rawItem.tagNames ? rawItem.tagNames.split(',') : [],
      images: rawItem.productImageUrls
        ? rawItem.productImageUrls.split(',')
        : [], // Array of image_url strings.
      created_at: rawItem.product_created_at,
      modified_at: rawItem.product_modified_at,
      deleted_at: rawItem.product_deleted_at,
    }));

    // To get the total count correctly when grouping, you might need a separate count query.
    // For simplicity, we'll assume "entities" length is the current page count.
    // You may want to run a separate count query that matches your filters without pagination.
    const total = data.length; // Replace with a proper total count if needed.

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
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
