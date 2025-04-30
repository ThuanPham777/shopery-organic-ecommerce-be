// product/product.service.ts
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from '../../../../database/entities/product/product.entity';
import { Category } from '../../../../database/entities/category/category.entity';
import { Brand } from '../../../../database/entities/brand/brand.entity';
import { Manufacturer } from '../../../../database/entities/manufacturer/manufacturer.entity';
import { Tag } from '../../../../database/entities/tag/tag.entity';
import { ProductImages } from '../../../../database/entities/product/product-image.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import {
  uploadToCloudinary,
  extractPublicId,
  deleteFromCloudinary,
} from 'src/common/helper/cloudinary.helper';
import { UpdateProductDto } from '../dto/update-product.dto';
import { GetAllProducts } from '../dto/get-all-products.dto';
@Injectable()
export class ProductService {
  constructor(
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

    @InjectRepository(ProductImages)
    private readonly productImageRepository: Repository<ProductImages>,
  ) {}

  static folder = 'shopery-organic/products';

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

  // Method to create a new product
  async createProduct(dto: CreateProductDto, thumbnail: Express.Multer.File) {
    try {
      if (!thumbnail) {
        throw new BadRequestException('Thumbnail file is required');
      }

      // Upload thumbnail lên Cloudinary
      const uploadResult: any = await uploadToCloudinary(
        thumbnail,
        ProductService.folder,
      );
      dto.thumbnail = uploadResult.secure_url;

      // Tìm category, manufacturer, brand
      const [category, manufacturer, brand] = await Promise.all([
        this.categoryRepository.findOne({ where: { id: dto.categoryId } }),
        this.manufacturerRepository.findOne({
          where: { id: dto.manufacturerId },
        }),
        this.brandRepository.findOne({ where: { id: dto.brandId } }),
      ]);

      if (!category) throw new NotFoundException('Category not found');
      if (!manufacturer) throw new NotFoundException('Manufacturer not found');
      if (!brand) throw new NotFoundException('Brand not found');

      // Xử lý tags
      let tags = await this.tagRepository.find({
        where: { name: In(dto.tagNames) },
      });

      // Nếu có tag chưa tồn tại, tạo mới
      const existingTagNames = tags.map((tag) => tag.name);
      const newTagNames = dto.tagNames.filter(
        (name) => !existingTagNames.includes(name),
      );

      if (newTagNames.length > 0) {
        const newTags = newTagNames.map((name) =>
          this.tagRepository.create({ name }),
        );
        await this.tagRepository.save(newTags);
        tags = [...tags, ...newTags];
      }

      // Tạo sản phẩm mới
      const product = this.productRepository.create({
        ...dto,
        category,
        manufacturer,
        brand,
        tags,
      });

      const newProduct = await this.productRepository.save(product);

      return {
        data: newProduct,
        success: true,
        message: 'Product created successfully',
      };
    } catch (error) {
      console.error('Error creating product:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to create product',
      );
    }
  }

  // Method to update a product
  async updateProduct(
    productId: number,
    dto: UpdateProductDto,
    thumbnail?: Express.Multer.File,
  ) {
    const product = await this.productRepository.findOne({
      where: { id: Number(productId) },
      relations: ['category', 'manufacturer', 'brand', 'tags'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Cập nhật thông tin sản phẩm
    Object.assign(product, dto);

    // Nếu có ảnh mới, upload lên Cloudinary
    if (thumbnail) {
      const uploadResult = await uploadToCloudinary(
        thumbnail,
        ProductService.folder,
      );
      //Logger.log('uploadResult', uploadResult);
      product.thumbnail = uploadResult.secure_url;
    }

    // Tìm category, manufacturer, brand
    const [category, manufacturer, brand] = await Promise.all([
      this.categoryRepository.findOne({ where: { id: dto.categoryId } }),
      this.manufacturerRepository.findOne({
        where: { id: dto.manufacturerId },
      }),
      this.brandRepository.findOne({ where: { id: dto.brandId } }),
    ]);

    if (!category) throw new NotFoundException('Category not found');
    if (!manufacturer) throw new NotFoundException('Manufacturer not found');
    if (!brand) throw new NotFoundException('Brand not found');

    // Cập nhật tags
    if (dto.tagNames) {
      if (!Array.isArray(dto.tagNames)) {
        throw new BadRequestException('tagNames must be an array');
      }

      let tags = await this.tagRepository.find({
        where: { name: In(dto.tagNames) },
      });
      const existingTagNames = tags.map((tag) => tag.name);
      const newTagNames = dto.tagNames.filter(
        (name) => !existingTagNames.includes(name),
      );

      if (newTagNames.length > 0) {
        const newTags = newTagNames.map((name) =>
          this.tagRepository.create({ name }),
        );
        await this.tagRepository.save(newTags);
        tags = [...tags, ...newTags];
      }

      product.tags = tags;
    }

    const updatedProduct = await this.productRepository.save(product);
    return {
      data: updatedProduct,
      success: true,
      message: 'Product updated successfully',
    };
  }

  // <ethod to delete a product
  async deleteProductById(productId: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Nếu sản phẩm có ảnh thumbnail, xóa trên Cloudinary trước
    if (product.thumbnail) {
      const publicId = extractPublicId(product.thumbnail);
      await deleteFromCloudinary(publicId);
    }

    // Xóa ảnh trên cloudinary
    const images = await this.productImageRepository.find({
      where: { product: { id: productId } },
      relations: ['product'],
    });

    if (images) {
      // Xóa tất cả ảnh trên Cloudinary
      const publicIds = images.map((img) => extractPublicId(img.image_url));
      await Promise.all(publicIds.map((id) => deleteFromCloudinary(id)));
    }

    // Xóa sản phẩm khỏi database
    await this.productRepository.delete({ id: productId });

    return { success: true, message: 'Product deleted successfully' };
  }

  // Handle with images
  async getProductImages(productId: number) {
    const images = await this.productImageRepository.find({
      where: { product: { id: productId } },
      select: ['id', 'image_url'],
    });

    if (images.length === 0) {
      throw new NotFoundException('No images found for this product');
    }

    return { success: true, data: images };
  }

  // Create or add images for products
  async uploadProductImages(productId: number, files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Images are required');
    }

    // Upload tất cả ảnh lên Cloudinary
    const uploadPromises = files.map((file) =>
      uploadToCloudinary(file, ProductService.folder),
    );
    const uploadResults = await Promise.all(uploadPromises);

    // Lưu đường dẫn vào database
    const imageRecords = uploadResults.map((result) => {
      return this.productImageRepository.create({
        product: { id: Number(productId) },
        image_url: result.secure_url,
      });
    });

    await this.productImageRepository.save(imageRecords);

    return {
      success: true,
      message: 'Product images uploaded successfully',
      data: imageRecords,
    };
  }

  // update product image
  async updateProductImage(
    productId: number,
    imageId: number,
    newImage: Express.Multer.File,
  ) {
    // Tìm ảnh hiện tại trong database
    const currentImage = await this.productImageRepository.findOne({
      where: {
        id: imageId,
        product: { id: productId },
      },
      relations: ['product'],
    });

    if (!currentImage) {
      throw new NotFoundException('Image not found');
    }

    // Xóa ảnh cũ trên Cloudinary
    const publicId = extractPublicId(currentImage.image_url);
    await deleteFromCloudinary(publicId);

    // Upload ảnh mới lên Cloudinary
    const uploadResult: any = await uploadToCloudinary(
      newImage,
      ProductService.folder,
    );
    currentImage.image_url = uploadResult.secure_url;

    // Cập nhật ảnh trong database
    await this.productImageRepository.save(currentImage);

    return {
      success: true,
      message: 'Update image successfully',
      data: currentImage,
    };
  }

  // delete a product iamge
  async deleteProductImage(productId: number, imageId: number) {
    const image = await this.productImageRepository.findOne({
      where: {
        id: imageId,
        product: { id: productId },
      },
      relations: ['product'],
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    // delete images Cloudinary
    const publicId = extractPublicId(image.image_url);
    await deleteFromCloudinary(publicId);

    // Xóa ảnh khỏi database
    await this.productImageRepository.delete(image.id);

    return { success: true, message: 'Image deleted successfully' };
  }

  async deleteAllProductImages(productId: number) {
    // Lấy danh sách ảnh của sản phẩm
    const images = await this.productImageRepository.find({
      where: { product: { id: productId } },
      relations: ['product'],
    });

    if (images.length === 0) {
      throw new NotFoundException('No images found');
    }

    // Xóa tất cả ảnh trên Cloudinary
    const publicIds = images.map((img) => extractPublicId(img.image_url));
    await Promise.all(publicIds.map((id) => deleteFromCloudinary(id)));

    // Xóa ảnh khỏi database (Dùng remove thay vì delete)
    await this.productImageRepository.remove(images);

    return { success: true, message: 'Images deleted successfully' };
  }
}
