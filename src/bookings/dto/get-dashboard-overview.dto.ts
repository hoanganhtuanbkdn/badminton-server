import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

// DTO for getting dashboard overview
export class GetDashboardOverviewDto {
  @ApiPropertyOptional({ description: 'Start date for the overview period' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date for the overview period' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Filter by court ID' })
  @IsString()
  @IsOptional()
  courtId?: string;

  @ApiPropertyOptional({ description: 'Filter by position ID' })
  @IsString()
  @IsOptional()
  positionId?: string;

  @ApiPropertyOptional({ description: 'Search by customer name' })
  @IsString()
  @IsOptional()
  customerName?: string;
}
