import { IsString, IsDecimal, IsDate, IsNotEmpty } from 'class-validator';

export class CreateVoucherDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsDecimal()
  discount_percentage: number;

  @IsDate()
  valid_from: Date;

  @IsDate()
  valid_until: Date;
}
