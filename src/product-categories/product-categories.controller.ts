import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto } from './dtos/create-product-category.dto';
import { UpdateProductCategoryDto } from './dtos/update-product-category.dto';
import { ProductCategory } from './product-categories.entity';
import { ProductCategoryListDto } from './dtos/product-category-list.dto';
import { PaginatedProductCategoryListDto } from './dtos/paginated-product-category-list.dto';

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
  @ApiResponse({ status: 200, description: 'Return all product categories with court information and product count.', type: PaginatedProductCategoryListDto })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('search') search?: string
  ): Promise<PaginatedProductCategoryListDto> {
    return this.productCategoriesService.findAll({ page, limit, sortBy, sortOrder, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product category by id' })
  @ApiResponse({ status: 200, description: 'Return the product category with court information.', type: ProductCategory })
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
