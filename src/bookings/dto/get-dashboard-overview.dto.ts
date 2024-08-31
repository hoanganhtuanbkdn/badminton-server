import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Enum for defining the period options
export enum OverviewPeriod {
  TODAY = 'today',
  THIS_WEEK = 'this_week',
  THIS_MONTH = 'this_month',
  THIS_QUARTER = 'this_quarter',
  CUSTOM = 'custom',
}

// DTO for getting dashboard overview
export class GetDashboardOverviewDto {
  @ApiProperty({ enum: OverviewPeriod, description: 'Display period: today, this week, this month, this quarter, or custom' })
  @IsEnum(OverviewPeriod)
  period: OverviewPeriod;

  @ApiProperty({ description: 'Start date (used when period is CUSTOM)', required: false })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({ description: 'End date (used when period is CUSTOM)', required: false })
  @IsOptional()
  @IsString()
  endDate?: string;
}
