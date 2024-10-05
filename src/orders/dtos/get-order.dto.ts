import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetOrderDto {
  @ApiPropertyOptional({ description: 'Page number' })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Number of items per page' })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: 'Field to sort by', example: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ description: 'Sort order', enum: SortOrder, example: SortOrder.DESC })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({ description: 'Filter by booking detail ID' })
  @IsOptional()
  @IsString()
  bookingDetailId?: string;
}
