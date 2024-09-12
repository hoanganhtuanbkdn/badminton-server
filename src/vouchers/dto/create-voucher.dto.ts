import { IsString, IsNumber, IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVoucherDto {
  @ApiProperty({
    description: 'Code of the voucher',
    example: 'SUMMER2024',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Percentage discount applied by the voucher',
    example: 15.0,
  })
  discountPercentage: number;

  @ApiProperty({
    description: 'Fixed discount value applied by the voucher',
    example: 50000,
  })
  discountValue: number;

  @ApiProperty({
    description: 'Start date from which the voucher is valid',
    example: '2024-09-01T00:00:00.000Z',
  })
  validFrom: Date;

  @ApiProperty({
    description: 'End date until which the voucher is valid',
    example: '2024-12-31T23:59:59.000Z',
  })
  validUntil: Date;

  @ApiProperty({
    description: 'Maximum number of times the voucher can be used',
    example: 100,
  })
  maxUsage: number;

  @ApiProperty({
    description: 'Number of times the voucher is still available for use',
    example: 50,
  })
  availableUsage: number;
}
