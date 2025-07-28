// product/product.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  In,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Product } from 'src/database/entities/product/product.entity';
import { GetAllProductsInDto } from '../dto/get-all-products.in.dto';
import { DEFAULT_PER_PAGE } from 'src/contants/common.constant';
import { Category } from 'src/database/entities/category/category.entity';
import { Brand } from 'src/database/entities/brand/brand.entity';
import { Manufacturer } from 'src/database/entities/manufacturer/manufacturer.entity';
import { Tag } from 'src/database/entities/tag/tag.entity';
import { CreateProductInDto } from '../dto/create-product.in.dto';
import { UpdateProductInDto } from '../dto/update-product.in.dto';
import { ProductImages } from 'src/database/entities/product/product-image.entity';
import { ProductAttributeValue } from 'src/database/entities/attribute/product-attribute-value.entity';
import { AttributeValue } from 'src/database/entities/attribute/attribute-value.entity';
import { CreateProductOutDto } from '../dto/create-product.out.dto';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,

    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,

    @InjectRepository(ProductAttributeValue)
    private readonly productAttributeValueRepository: Repository<ProductAttributeValue>,

    @InjectRepository(AttributeValue)
    private readonly attributeValueRepository: Repository<AttributeValue>,
  ) {}
  // Method to fetch all products
  async findAll(
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
      search,
      sorts = [],
    } = query;

    let [products, total] = await this.productRepository.findAndCount({
      where: {
        deleted_at: IsNull(),
        ...(minPrice && { price: MoreThanOrEqual(minPrice) }),
        ...(maxPrice && { price: LessThanOrEqual(maxPrice) }),
        ...(category && { category: { slug: category, deleted_at: IsNull() } }),
        ...(manufacturer && {
          manufacturer: { name: manufacturer, deleted_at: IsNull() },
        }),
        ...(brand && { brand: { name: brand, deleted_at: IsNull() } }),
        ...(tag && { tags: { name: tag, deleted_at: IsNull() } }),
      },
      relations: ['category', 'manufacturer', 'brand', 'tags', 'images'],
      order: sorts.length
        ? Object.fromEntries(sorts.map((s) => s.split('|')))
        : { created_at: 'DESC' },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    if (search) {
      products = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return { products, total };
  }

  // Method fetch product by id
  async findById(productId: number): Promise<Product> {
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
  async create(dto: CreateProductInDto): Promise<Product> {
    // Kiểm tra slug trùng lặp
    const existingSlug = await this.productRepository.findOne({
      where: { slug: dto.slug },
    });
    if (existingSlug) {
      throw new ConflictException('Slug already exists');
    }

    // Validate relations
    const category = await this.categoryRepository.findOne({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const brand = await this.brandRepository.findOne({
      where: { id: dto.brandId },
    });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    const manufacturer = await this.manufacturerRepository.findOne({
      where: { id: dto.manufacturerId },
    });
    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    // Lấy danh sách tags
    const tags = await this.tagRepository.find({
      where: { id: In(dto.tagIds || []) },
    });
    if (tags.length !== (dto.tagIds?.length || 0)) {
      throw new NotFoundException('One or more tags not found');
    }

    // Tạo product entity
    const product = this.productRepository.create({
      ...dto,
      category,
      brand,
      manufacturer,
      tags,
      images: dto.images?.map((url) => {
        const image = new ProductImages();
        image.image_url = url;
        return image;
      }),
    });

    await this.productRepository.save(product);

    const values = await this.attributeValueRepository.find();

    if (values.length !== dto.attributeValueIds?.length) {
      throw new BadRequestException(
        'One or more attribute values are invalid for this category',
      );
    }

    // 4. Gán ProductAttributeValue
    const pavs = values.map((value) =>
      this.productAttributeValueRepository.create({
        product,
        attributeValue: value,
      }),
    );
    await this.productAttributeValueRepository.save(pavs);

    return product;
  }

  // Method to update a product
  async update(productId: number, dto: UpdateProductInDto): Promise<Product> {
    // find product need to update
    const product = await this.productRepository.findOne({
      where: { id: Number(productId) },
      relations: ['category', 'manufacturer', 'brand', 'tags', 'images'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Kiểm tra slug mới (nếu có)
    if (dto.slug && dto.slug !== product.slug) {
      const existingSlug = await this.productRepository.findOne({
        where: { slug: dto.slug },
      });
      if (existingSlug) {
        throw new ConflictException('Slug already exists');
      }
      product.slug = dto.slug;
    }

    // Cập nhật các quan hệ
    if (dto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: dto.categoryId },
      });
      if (!category) throw new NotFoundException('Category not found');
      product.category = category;
    }

    if (dto.brandId) {
      const brand = await this.brandRepository.findOne({
        where: { id: dto.brandId },
      });
      if (!brand) throw new NotFoundException('Brand not found');
      product.brand = brand;
    }

    if (dto.manufacturerId) {
      const manufacturer = await this.manufacturerRepository.findOne({
        where: { id: dto.manufacturerId },
      });
      if (!manufacturer) throw new NotFoundException('Manufacturer not found');
      product.manufacturer = manufacturer;
    }

    // Xử lý tags
    if (dto.tagIds !== undefined) {
      const tags = await this.tagRepository.find({
        where: { id: In(dto.tagIds) },
      });
      if (tags.length !== dto.tagIds.length) {
        throw new NotFoundException('One or more tags not found');
      }
      product.tags = tags;
    }

    // Merge các thay đổi
    const {
      categoryId,
      brandId,
      manufacturerId,
      tagIds,
      images,
      ...updateData
    } = dto;
    this.productRepository.merge(product, updateData);

    await this.productRepository.save(product);

    // Nếu có cập nhật attribute values
    if (dto.attributeValueIds?.length) {
      // Tìm attributeValues được update
      const attributeValues = await this.attributeValueRepository.findBy({
        id: In(dto.attributeValueIds),
      });

      // Xóa attribute cũ
      await this.productAttributeValueRepository.delete({
        product: { id: productId },
      });

      // Gán attribute mới
      const newLinks = attributeValues.map((value) =>
        this.productAttributeValueRepository.create({
          product,
          attributeValue: value,
        }),
      );
      await this.productAttributeValueRepository.save(newLinks);
    }

    return product;
  }

  // Method to delete a product
  async delete(productId: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepository.softDelete({ id: productId });
  }
}
