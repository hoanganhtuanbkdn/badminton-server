import { IsString, IsNumber, IsDate, IsNotEmpty } from 'class-validator';

export class CreateVoucherDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  discount_percentage: number;

  @IsDate()
  valid_from: Date;

  @IsDate()
  valid_until: Date;
}
