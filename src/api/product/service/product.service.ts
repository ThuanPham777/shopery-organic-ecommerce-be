// product/product.service.ts
import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from '../../../database/entities/product/product.entity';
import { Category } from '../../../database/entities/category/category.entity';
import { Brand } from '../../../database/entities/brand/brand.entity';
import { Manufacturer } from '../../../database/entities/manufacturer/manufacturer.entity';
import { Tag } from '../../../database/entities/tag/tag.entity';
import { ProductImages } from '../../../database/entities/product/product-image.entity';
import { CreateProductDto } from '../../../api/product/dto/create-product.dto';
import { GetProductsDto } from '../dto/get-products.dto.';
import { uploadToCloudinary, extractPublicId, deleteFromCloudinary } from 'src/common/helper/cloudinary.helper'
import { UpdateProductDto } from '../dto/update-product.dto';
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
  ) {

  }

  static folder = "shopery-organic/products";
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
  let qb = this.productRepository.createQueryBuilder('product')
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
    .addSelect('GROUP_CONCAT(DISTINCT productImage.image_url)', 'productImageUrls')
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
    qb = qb.andWhere(qb => {
      const subQuery = qb.subQuery()
        .select('AVG(review.rating)')
        .from('Review', 'review')
        .where('review.product_id = product.id')
        .getQuery();
      return `${subQuery} >= :rating`;
    }, { rating });
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
  const data = raw.map(rawItem => ({
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
    images: rawItem.productImageUrls ? rawItem.productImageUrls.split(',') : [],  // Array of image_url strings.
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
    totalPages: Math.ceil(total / limit)
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
      'reviews.user'  // This loads the user data for each review.
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
    tags: product.tags ? product.tags.map(t => t.name) : [],
    images: product.images
      ? product.images.map(pi => pi.image_url)
      : [],
    reviews: product.reviews
      ? product.reviews.map(review => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          created_at: review.created_at,
          // Map user details from the review.
          user: review.user
            ? {
                username: review.user.username,
                avatar_url: review.user.avatar_url
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
    //console.log('test createProduct................');

     console.log('Received file:', thumbnail);

    if (!thumbnail) {
      throw new BadRequestException('Thumbnail file is required');
    }

    // Upload thumbnail lên Cloudinary
    const uploadResult: any = await uploadToCloudinary(thumbnail, ProductService.folder);
    dto.thumbnail = uploadResult.secure_url;

    // Tìm category, manufacturer, brand
    const [category, manufacturer, brand] = await Promise.all([
      this.categoryRepository.findOne({ where: { id: dto.categoryId } }),
      this.manufacturerRepository.findOne({ where: { id: dto.manufacturerId } }),
      this.brandRepository.findOne({ where: { id: dto.brandId } }),
    ]);

    if (!category) throw new NotFoundException('Category not found');
    if (!manufacturer) throw new NotFoundException('Manufacturer not found');
    if (!brand) throw new NotFoundException('Brand not found');

    // Xử lý tags
    let tags = await this.tagRepository.find({ where: { name: In(dto.tagNames) } });

    // Nếu có tag chưa tồn tại, tạo mới
    const existingTagNames = tags.map(tag => tag.name);
    const newTagNames = dto.tagNames.filter(name => !existingTagNames.includes(name));

    if (newTagNames.length > 0) {
      const newTags = newTagNames.map(name => this.tagRepository.create({ name }));
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

    await this.productRepository.save(product);

    return { success: true, message: 'Product created successfully' };
  } catch (error) {
    console.error('Error creating product:', error);
    throw new InternalServerErrorException(error.message || 'Failed to create product');
    }

  }

  // Method to update a product
  async updateProduct(productId: number, dto: UpdateProductDto, thumbnail?: Express.Multer.File) {
  const product = await this.productRepository.findOne({
    where: { id: Number(productId) },
    relations: ['category', 'manufacturer', 'brand', 'tags'],
  });

    //console.log("Product", product);

  if (!product) {
    throw new NotFoundException('Product not found');
    }

    // Cập nhật thông tin sản phẩm
  Object.assign(product, dto);

    // Nếu có ảnh mới, upload lên Cloudinary
    //console.log("Thumbnail", thumbnail)
  if (thumbnail) {
    const uploadResult = await uploadToCloudinary(thumbnail, ProductService.folder);
    console.log("uploadResult", uploadResult)
    product.thumbnail = uploadResult.secure_url;
  }

  // Tìm category, manufacturer, brand
    const [category, manufacturer, brand] = await Promise.all([
      this.categoryRepository.findOne({ where: { id: dto.categoryId } }),
      this.manufacturerRepository.findOne({ where: { id: dto.manufacturerId } }),
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

    let tags = await this.tagRepository.find({ where: { name: In(dto.tagNames) } });
    const existingTagNames = tags.map(tag => tag.name);
    const newTagNames = dto.tagNames.filter(name => !existingTagNames.includes(name));

    if (newTagNames.length > 0) {
      const newTags = newTagNames.map(name => this.tagRepository.create({ name }));
      await this.tagRepository.save(newTags);
      tags = [...tags, ...newTags];
    }

    product.tags = tags;
  }

  await this.productRepository.save(product);
  return { success: true, message: 'Product updated successfully' };
}


  // <ethod to delete a product
  async deleteProductById(productId: number) {
    const product = await this.productRepository.findOne({ where: { id: productId } });

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
        relations: ['product']
    });

    if (images) {
        // Xóa tất cả ảnh trên Cloudinary
      const publicIds = images.map(img => extractPublicId(img.image_url));
      await Promise.all(publicIds.map(id => deleteFromCloudinary(id)));
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
    const uploadPromises = files.map(file => uploadToCloudinary(file, ProductService.folder));
    const uploadResults = await Promise.all(uploadPromises);

    // Lưu đường dẫn vào database
    const imageRecords = uploadResults.map(result => {
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
  async updateProductImage(productId: number, imageId: number, newImage: Express.Multer.File) {
    // Tìm ảnh hiện tại trong database
    const currentImage = await this.productImageRepository.findOne({
        where: {
            id: imageId,
            product: { id: productId }
        },
        relations: ['product']
    });

    if (!currentImage) {
        throw new NotFoundException('Image not found');
    }

    // Xóa ảnh cũ trên Cloudinary
    const publicId = extractPublicId(currentImage.image_url);
    await deleteFromCloudinary(publicId);

    // Upload ảnh mới lên Cloudinary
    const uploadResult: any = await uploadToCloudinary(newImage, ProductService.folder);
    currentImage.image_url = uploadResult.secure_url;

    // Cập nhật ảnh trong database
    await this.productImageRepository.save(currentImage);

    return {
      success: true,
      message: 'Update image successfully',
      data: currentImage
    };
}


   // delete a product iamge
  async deleteProductImage(productId: number, imageId: number) {
    const image = await this.productImageRepository.findOne({
        where: {
            id: imageId,
            product: { id: productId}
        },
        relations: ['product']
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
        relations: ['product']
    });

    if (images.length === 0) {
        throw new NotFoundException('No images found');
    }

    console.log('Images found:', images);

    // Xóa tất cả ảnh trên Cloudinary
    const publicIds = images.map(img => extractPublicId(img.image_url));
    await Promise.all(publicIds.map(id => deleteFromCloudinary(id)));

    // Xóa ảnh khỏi database (Dùng remove thay vì delete)
    await this.productImageRepository.remove(images);

    return { success: true, message: 'Images deleted successfully' };
}
}
