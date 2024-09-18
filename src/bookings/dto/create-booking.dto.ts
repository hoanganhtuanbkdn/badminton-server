import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateBookingDetailDto } from 'src/booking-details/dto';
import { CreateCustomerDto } from 'src/customers/dto';
import { Column } from 'typeorm';

export class CreateBookingDto {
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
  @IsNumber()
  totalAmount: number;

  @ApiProperty({
    description: 'Payment status of the booking',
    example: 'Paid',
  })
  @IsString()
  @IsNotEmpty()
  paymentStatus: string;

  @ApiProperty({
    description: 'Payment method of the booking: Tiền mặt, chuyển khoản',
    // example: 'Paid',
  })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({
    description: 'Payment type of the booking: Cọc trước 50%, trả trước 100%, trả sau',
    // example: 'Paid',
  })
  @IsString()
  @IsNotEmpty()
  paymentType: string;

  @ApiProperty({
    description: 'Voucher code applied to the booking, if any',
    example: 'DISCOUNT10',
    required: false,
  })
  @IsOptional()
  @IsString()
  voucherCode?: string;

  @ApiProperty({
    description: 'Booking Code',
    example: 'VM123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  bookingCode?: string;

  @ApiProperty({
    description: 'Payment time',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentAt?: string;

  @ApiProperty({
    description: 'Additional notes for the booking',
    example: 'Please prepare court in advance',
    required: false,
  })
  @IsOptional()
  @IsString()
  additionalNotes?: string;


  @ApiProperty({
    description: 'Customer information for the booking',
    type: () => CreateCustomerDto,
    required: false,
  })
  @ValidateNested()
  @Type(() => CreateCustomerDto)
  @IsOptional()
  customer?: CreateCustomerDto;

  @ApiProperty({
    description: 'Details of the booking, including positions and time slots',
    type: [CreateBookingDetailDto],
  })
  @ValidateNested({ each: true })
  @Type(() => CreateBookingDetailDto)
  @IsArray()
  bookingDetails: CreateBookingDetailDto[];
}
