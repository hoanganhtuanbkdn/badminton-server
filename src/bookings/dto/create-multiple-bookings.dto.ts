import { CreateBookingDto } from './create-booking.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMultipleBookingsDto {
  @ApiProperty({ type: [CreateBookingDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBookingDto)
  bookings: CreateBookingDto[];
}
