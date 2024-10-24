import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../orders.entity';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum OrderType {
  ALL = 'ALL',
  WALK_IN = 'WALK_IN',
  BOOKING = 'BOOKING',
}

export class GetOrderDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Page number' })
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Number of items per page' })
  limit?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Field to sort by' })
  sortBy?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  @ApiPropertyOptional({ enum: SortOrder, description: 'Sort order' })
  sortOrder?: SortOrder;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter by booking detail ID' })
  bookingDetailId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter by court ID' })
  courtId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter by position ID' })
  positionId?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  @ApiPropertyOptional({ enum: OrderStatus, description: 'Filter by payment status' })
  paymentStatus?: OrderStatus;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Search by customer name or phone number' })
  customerName?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({ description: 'Start date for filtering by bookingDate' })
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({ description: 'End date for filtering by bookingDate' })
  endDate?: Date;

  @IsOptional()
  @IsEnum(OrderType)
  @ApiPropertyOptional({ enum: OrderType, description: 'Filter by order type', default: OrderType.ALL })
  type?: OrderType = OrderType.ALL;
}
