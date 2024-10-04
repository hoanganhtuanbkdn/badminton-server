import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductCategoryDto {
  @ApiProperty({ description: 'Name of the product category' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Description of the product category' })
  @IsString()
  @IsOptional()
  description?: string;
}
