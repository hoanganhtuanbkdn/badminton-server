import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Name of the product' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Price of the product' })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ description: 'Description of the product' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'The quantity of the product in stock' })
  @IsNumber()
  @IsOptional()
  stockQuantity: number;

  @ApiPropertyOptional({ description: 'ID of the product category' })
  @IsString()
  @IsOptional()
  categoryId: string;

  @ApiProperty({ description: 'ID of the court' })
  courtId: string;

  @ApiPropertyOptional({ description: 'URL of the product image' })
  @IsString()
  @IsOptional()
  image?: string;
}
