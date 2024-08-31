import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum SortByFields {
  CREATED_AT = 'createdAt',
  BOOKING_DATE = 'bookingDate',
}

export class GetBookingDetailsDto {
  @ApiPropertyOptional({ description: 'Page number for pagination' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ description: 'Number of items per page for pagination' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({ description: 'Field to sort by', enum: SortByFields })
  @IsOptional()
  @IsEnum(SortByFields)
  sortBy?: SortByFields;

  @ApiPropertyOptional({ description: 'Sort order (ASC or DESC)', enum: SortOrder })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;

  @ApiPropertyOptional({ description: 'Filter by court ID' })
  @IsOptional()
  @IsString()
  courtId?: string;

  @ApiPropertyOptional({ description: 'Filter by position ID' })
  @IsOptional()
  @IsString()
  positionId?: string;

  @ApiPropertyOptional({ description: 'Filter by owner ID' })
  @IsOptional()
  @IsString()
  ownerId?: string;

  @ApiPropertyOptional({ description: 'Filter by payment status (e.g., Paid, Unpaid)' })
  @IsOptional()
  @IsString()
  paymentStatus?: string;

  @ApiPropertyOptional({ description: 'Search by customer name' })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({ description: 'Start date for filtering by bookingDate', example: '2024-08-01' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date for filtering by bookingDate', example: '2024-08-31' })
  @IsOptional()
  @IsString()
  endDate?: string;
}
