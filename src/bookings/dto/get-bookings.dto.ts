import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetBookingsDto {
  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  page?: number;

  @ApiPropertyOptional({ description: 'Number of items per page', default: 10 })
  limit?: number;

  @ApiPropertyOptional({ description: 'Field to sort by', example: 'createdAt' })
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ description: 'Sort order', enum: SortOrder, example: SortOrder.DESC })
  sortOrder?: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({ description: 'Filter by customer ID', example: 'customerId' })
  customerId?: string;

  @ApiPropertyOptional({ description: 'Filter by court ID', example: 'courtId' })
  courtId?: string;
}
