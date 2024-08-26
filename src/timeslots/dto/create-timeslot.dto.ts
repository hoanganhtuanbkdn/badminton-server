import { IsString, IsNotEmpty, IsDecimal } from 'class-validator';

export class CreateTimeSlotDto {
  @IsString()
  @IsNotEmpty()
  start_time: string;

  @IsString()
  @IsNotEmpty()
  end_time: string;

  @IsDecimal()
  fixed_fee: number;

  @IsDecimal()
  walk_in_fee: number;

  @IsString()
  @IsNotEmpty()
  courtId: string;
}
