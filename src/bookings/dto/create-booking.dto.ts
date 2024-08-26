import { IsString, IsNotEmpty, IsDecimal, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({
    description: 'ID of the customer making the booking',
    example: 'customerId',
  })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({
    description: 'ID of the court being booked',
    example: 'courtId',
  })
  @IsString()
  @IsNotEmpty()
  courtId: string;

  @ApiProperty({
    description: 'Total amount for the booking',
    example: 150000,
  })
  @IsDecimal()
  totalAmount: number;

  @ApiProperty({
    description: 'Payment status of the booking',
    example: 'Paid',
  })
  @IsString()
  @IsNotEmpty()
  paymentStatus: string;

  @ApiProperty({
    description: 'Type of booking (e.g., Scheduled, Flexible)',
    example: 'Scheduled',
  })
  @IsString()
  @IsNotEmpty()
  bookingType: string;

  @ApiProperty({
    description: 'Voucher code applied to the booking, if any',
    example: 'DISCOUNT10',
    required: false,
  })
  @IsOptional()
  @IsString()
  voucherCode?: string;

  @ApiProperty({
    description: 'Additional notes for the booking',
    example: 'Please prepare court in advance',
    required: false,
  })
  @IsOptional()
  @IsString()
  additionalNotes?: string;
}
