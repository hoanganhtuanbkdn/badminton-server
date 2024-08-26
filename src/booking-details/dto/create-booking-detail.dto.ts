import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

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

  @IsNumber()
  duration: number;
}
