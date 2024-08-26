import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetBookingsDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page', example: 10 })
  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Field to sort by', example: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ description: 'Sort order', enum: SortOrder, example: SortOrder.DESC })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({ description: 'Filter by customer ID', example: 'customerId' })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiPropertyOptional({ description: 'Filter by court ID', example: 'courtId' })
  @IsOptional()
  @IsString()
  courtId?: string;
}
