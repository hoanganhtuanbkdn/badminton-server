import { IsString, IsNotEmpty, IsDecimal } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @IsString()
  @IsNotEmpty()
  payment_method: string;

  @IsString()
  @IsNotEmpty()
  account_holder: string;

  @IsString()
  @IsNotEmpty()
  bank_name: string;

  @IsString()
  @IsNotEmpty()
  account_number: string;

  @IsString()
  @IsNotEmpty()
  transaction_id: string;

  @IsDecimal()
  amount: number;

  @IsString()
  @IsNotEmpty()
  payment_status: string;

  @IsNotEmpty()
  payment_date: Date;
}
