import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto } from './dtos/create-product-category.dto';
import { UpdateProductCategoryDto } from './dtos/update-product-category.dto';
import { ProductCategory } from './product-categories.entity';

@ApiTags('product-categories')
@Controller('product-categories')
export class ProductCategoriesController {
  constructor(private readonly productCategoriesService: ProductCategoriesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new product category' })
  @ApiResponse({ status: 201, description: 'The product category has been successfully created.', type: ProductCategory })
  create(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    return this.productCategoriesService.create(createProductCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all product categories' })
  @ApiResponse({ status: 200, description: 'Return all product categories.', type: [ProductCategory] })
  findAll() {
    return this.productCategoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product category by id' })
  @ApiResponse({ status: 200, description: 'Return the product category.', type: ProductCategory })
  findOne(@Param('id') id: string) {
    return this.productCategoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product category' })
  @ApiResponse({ status: 200, description: 'The product category has been successfully updated.', type: ProductCategory })
  update(@Param('id') id: string, @Body() updateProductCategoryDto: UpdateProductCategoryDto) {
    return this.productCategoriesService.update(id, updateProductCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product category' })
  @ApiResponse({ status: 200, description: 'The product category has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.productCategoriesService.remove(id);
  }
}
