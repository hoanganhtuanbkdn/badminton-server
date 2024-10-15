import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ description: 'The ID of the order' })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ description: 'The ID of the product' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'The quantity of the product' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'The status of the order item', enum: ['PAID', 'UNPAID'], example: 'UNPAID' })
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty({ description: 'The payment method of the order item', enum: ['TRANSFER', 'CASH'], example: 'TRANSFER' })
  @IsString()
  @IsOptional()
  paymentMethod: string;

  @ApiProperty({ description: 'The notes of the order item', example: 'Special instructions' })
  @IsString()
  @IsOptional()
  notes: string;

  @ApiProperty({ description: 'The name of the customer', required: false })
  @IsString()
  @IsOptional()
  customerName?: string;
}
