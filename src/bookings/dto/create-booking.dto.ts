import { IsString, IsNotEmpty, IsDecimal, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  courtId: string;

  @IsDecimal()
  total_amount: number;

  @IsString()
  @IsNotEmpty()
  payment_status: string;

  @IsString()
  @IsNotEmpty()
  booking_type: string;

  @IsOptional()
  @IsString()
  voucher_code?: string;

  @IsOptional()
  @IsString()
  additional_notes?: string;
}
