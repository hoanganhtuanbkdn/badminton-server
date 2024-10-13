import { ApiProperty } from '@nestjs/swagger';
import { ProductCategory } from '../product-categories.entity';
import { Court } from '../../courts/courts.entity';

export class ProductCategoryListDto {
  @ApiProperty({ description: 'The unique identifier for the product category' })
  id: string;

  @ApiProperty({ description: 'The name of the product category' })
  name: string;

  @ApiProperty({ description: 'The description of the product category', required: false })
  description: string;

  @ApiProperty({ description: 'The court ID this category belongs to', required: false })
  courtId: string;

  @ApiProperty({ description: 'The court this category belongs to', type: () => Court, required: false })
  court: Court;

  @ApiProperty({ description: 'The number of products in this category' })
  productCount: number;

  @ApiProperty({ description: 'Creation date of the product category' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date of the product category' })
  updatedAt: Date;

  constructor(partial: Partial<ProductCategory & { productCount: number }>) {
    Object.assign(this, partial);
  }
}
