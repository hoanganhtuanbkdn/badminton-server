import { IsString, IsNotEmpty, IsDecimal } from 'class-validator';

export class CreateBookingDetailDto {
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @IsString()
  @IsNotEmpty()
  positionId: string;

  @IsString()
  @IsNotEmpty()
  timeSlotId: string;

  @IsDecimal()
  duration: number;
}
