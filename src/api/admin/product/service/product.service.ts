// product/product.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThanOrEqual, MoreThanOrEqual, Repository, SelectQueryBuilder, IsNull } from 'typeorm';
import { Product } from '../../../../database/entities/product/product.entity';
import { Category } from '../../../../database/entities/category/category.entity';
import { Brand } from '../../../../database/entities/brand/brand.entity';
import { Manufacturer } from '../../../../database/entities/manufacturer/manufacturer.entity';
import { Tag } from '../../../../database/entities/tag/tag.entity';
import { ProductImages } from '../../../../database/entities/product/product-image.entity';
import { CreateProductInDto } from '../dto/create-product.in.dto';
import { UpdateProductInDto } from '../dto/update-product.in.dto';
import { GetAllProductsInDto } from '../dto/get-all-products.in.dto';
import { DEFAULT_PER_PAGE } from 'src/contants/common.constant';
import { UploadService } from 'src/common/helper/upload/upload.service';
@Injectable()
export class ProductService {
  constructor(
    private readonly uploadService: UploadService,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,

    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,

  ) { }

  static folder = 'shopery-organic/products';

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

    return product;
  }

  // Method to create a new product
  async createProduct(createProductDto: CreateProductInDto): Promise<Product> {
    // Kiểm tra slug trùng lặp
    const existingSlug = await this.productRepository.findOne({
      where: { slug: createProductDto.slug },
    });
    if (existingSlug) {
      throw new ConflictException('Slug already exists');
    }

    // Validate relations
    const category = await this.categoryRepository.findOne({
      where: { id: createProductDto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const brand = await this.brandRepository.findOne({
      where: { id: createProductDto.brandId },
    });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    const manufacturer = await this.manufacturerRepository.findOne({
      where: { id: createProductDto.manufacturerId },
    });
    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    // Lấy danh sách tags
    const tags = await this.tagRepository.find({
      where: { id: In(createProductDto.tagIds || []) },
    });
    if (tags.length !== (createProductDto.tagIds?.length || 0)) {
      throw new NotFoundException('One or more tags not found');
    }

    // Tạo product entity
    const product = this.productRepository.create({
      ...createProductDto,
      category,
      brand,
      manufacturer,
      tags,
      images: createProductDto.images?.map((url) => {
        const image = new ProductImages();
        image.image_url = url;
        return image;
      }),
      sold: createProductDto.sold || 0, // Giá trị mặc định
    });

    return this.productRepository.save(product);
  }

  // Method to update a product
  async updateProduct(
    productId: number,
    updateProductDto: UpdateProductInDto,
  ): Promise<Product> {
    // find product need to update
    const product = await this.productRepository.findOne({
      where: { id: Number(productId) },
      relations: ['category', 'manufacturer', 'brand', 'tags', 'images'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Kiểm tra slug mới (nếu có)
    if (updateProductDto.slug && updateProductDto.slug !== product.slug) {
      const existingSlug = await this.productRepository.findOne({
        where: { slug: updateProductDto.slug }
      });
      if (existingSlug) {
        throw new ConflictException('Slug already exists');
      }
      product.slug = updateProductDto.slug;
    }

    // Cập nhật các quan hệ
    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateProductDto.categoryId },
      });
      if (!category) throw new NotFoundException('Category not found');
      product.category = category;
    }

    if (updateProductDto.brandId) {
      const brand = await this.brandRepository.findOne({
        where: { id: updateProductDto.brandId },
      });
      if (!brand) throw new NotFoundException('Brand not found');
      product.brand = brand;
    }

    if (updateProductDto.manufacturerId) {
      const manufacturer = await this.manufacturerRepository.findOne({
        where: { id: updateProductDto.manufacturerId },
      });
      if (!manufacturer) throw new NotFoundException('Manufacturer not found');
      product.manufacturer = manufacturer;
    }

    // Xử lý tags
    if (updateProductDto.tagIds !== undefined) {
      const tags = await this.tagRepository.find({
        where: { id: In(updateProductDto.tagIds) }
      });
      if (tags.length !== updateProductDto.tagIds.length) {
        throw new NotFoundException('One or more tags not found');
      }
      product.tags = tags;
    }

    // Merge các thay đổi
    const { categoryId, brandId, manufacturerId, tagIds, images, ...updateData } = updateProductDto;
    this.productRepository.merge(product, updateData);

    return this.productRepository.save(product);
  }

  // Method to delete a product
  async deleteProductById(productId: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepository.delete({ id: productId });

  }

  // Upload single image
  async uploadProductImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('Image is required');
    }
    const uploadResult = await this.uploadService.uploadToCloudinary(
      file,
      ProductService.folder,
    );
    return uploadResult.secure_url;
  }

  // Upload multiple images
  async uploadProductImages(files: Express.Multer.File[]): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Images are required');
    }
    const uploadPromises = files.map(file => this.uploadProductImage(file));
    return Promise.all(uploadPromises);
  }
}
