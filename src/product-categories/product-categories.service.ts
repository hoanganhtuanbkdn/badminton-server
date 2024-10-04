import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './product-categories.entity';
import { CreateProductCategoryDto } from './dtos/create-product-category.dto';
import { UpdateProductCategoryDto } from './dtos/update-product-category.dto';

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

  async findAll(): Promise<ProductCategory[]> {
    return await this.productCategoriesRepository.find();
  }

  async findOne(id: string): Promise<ProductCategory> {
    const productCategory = await this.productCategoriesRepository.findOne({ where: { id } });
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
