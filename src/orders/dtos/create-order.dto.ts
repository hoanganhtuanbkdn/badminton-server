import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus, PaymentMethod } from '../orders.entity';

class CreateOrderItemDto {
  @ApiProperty({ description: 'The ID of the product' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'The quantity of the product' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;


  @ApiProperty({ description: 'The notes of the order item', example: 'Special instructions' })
  @IsString()
  @IsOptional()
  notes: string;

  @ApiProperty({ description: 'The name of the customer', required: false })
  @IsString()
  @IsOptional()
  customerName?: string;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'The ID of the associated booking detail', required: false })
  @IsString()
  @IsOptional()
  bookingDetailId?: string;

  @ApiProperty({ description: 'The Order code of the order' })
  @IsString()
  @IsNotEmpty()
  orderCode: string;

  @ApiProperty({ description: 'The status of the order', enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({ description: 'The payment method of the order item', enum: ['TRANSFER', 'CASH'], example: 'TRANSFER' })
  @IsString()
  @IsOptional()
  paymentMethod: string;

  @ApiProperty({ description: 'The total amount of the order' })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({ description: 'The items in the order', type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
}
