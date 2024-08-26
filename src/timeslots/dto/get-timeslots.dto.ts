import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetTimeSlotsDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page', example: 10 })
  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Field to sort by', example: 'startTime' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'startTime';

  @ApiPropertyOptional({ description: 'Sort order', enum: SortOrder, example: SortOrder.DESC })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({ description: 'Filter by unit ID', example: 'unitId' })
  @IsOptional()
  @IsString()
  unitId?: string;
}
