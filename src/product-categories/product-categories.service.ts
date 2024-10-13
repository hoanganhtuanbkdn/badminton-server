import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ProductCategory } from './product-categories.entity';
import { CreateProductCategoryDto } from './dtos/create-product-category.dto';
import { UpdateProductCategoryDto } from './dtos/update-product-category.dto';
import { ProductCategoryListDto } from './dtos/product-category-list.dto';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private productCategoriesRepository: Repository<ProductCategory>,
  ) { }

  async create(createProductCategoryDto: CreateProductCategoryDto): Promise<ProductCategory> {
    const productCategory = this.productCategoriesRepository.create(createProductCategoryDto);
    return await this.productCategoriesRepository.save(productCategory);
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    search?: string;
  }): Promise<{ items: ProductCategoryListDto[]; total: number }> {
    const { page, limit, sortBy = 'createdAt', sortOrder = 'DESC', search } = options;

    const query = this.productCategoriesRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.court', 'court')
      .loadRelationCountAndMap('category.productCount', 'category.products');

    if (search) {
      query.andWhere('category.name LIKE :search OR category.description LIKE :search', { search: `%${search}%` });
    }

    if (page !== undefined && limit !== undefined) {
      query.skip((page - 1) * limit).take(limit);
    }

    const [categories, total] = await query
      .orderBy(`category.${sortBy}`, sortOrder)
      .getManyAndCount();

    const items = categories.map(category => new ProductCategoryListDto(category));

    return { items, total };
  }

  async findOne(id: string): Promise<ProductCategory> {
    const productCategory = await this.productCategoriesRepository.findOne({
      where: { id },
      relations: ['court'],
    });
    if (!productCategory) {
      throw new NotFoundException(`Product category with ID "${id}" not found`);
    }
    return productCategory;
  }

  async update(id: string, updateProductCategoryDto: UpdateProductCategoryDto): Promise<ProductCategory> {
    const productCategory = await this.findOne(id);
    Object.assign(productCategory, updateProductCategoryDto);
    return await this.productCategoriesRepository.save(productCategory);
  }

  async remove(id: string): Promise<void> {
    const result = await this.productCategoriesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product category with ID "${id}" not found`);
    }
  }
}
