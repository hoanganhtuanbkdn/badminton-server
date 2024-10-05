import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsArray, ValidateNested } from 'class-validator';
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
}

export class CreateOrderDto {
  @ApiProperty({ description: 'The ID of the associated booking detail' })
  @IsString()
  @IsNotEmpty()
  bookingDetailId: string;

  @ApiProperty({ description: 'The status of the order', enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({ description: 'The payment method for the order', enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ description: 'The total amount of the order' })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({ description: 'The items in the order', type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
}
