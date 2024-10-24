import { ApiProperty } from '@nestjs/swagger';

export class OrderOverviewDto {
  @ApiProperty({ description: 'Total number of orders' })
  totalOrders: number;

  @ApiProperty({ description: 'Total revenue' })
  totalRevenue: number;

  @ApiProperty({ description: 'Paid revenue' })
  paidRevenue: number;

  @ApiProperty({ description: 'Unpaid revenue' })
  unpaidRevenue: number;

  @ApiProperty({ description: 'Total number of paid orders' })
  paidOrders: number;

  @ApiProperty({ description: 'Total number of unpaid orders' })
  unpaidOrders: number;
}
