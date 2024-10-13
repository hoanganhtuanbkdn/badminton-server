import { ApiProperty } from '@nestjs/swagger';
import { ProductCategoryListDto } from './product-category-list.dto';

export class PaginatedProductCategoryListDto {
  @ApiProperty({ type: [ProductCategoryListDto] })
  items: ProductCategoryListDto[];

  @ApiProperty()
  total: number;
}
