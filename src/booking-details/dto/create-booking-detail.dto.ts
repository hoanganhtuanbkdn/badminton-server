import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDetailDto {
  @ApiProperty({
    description: 'ID of the booking associated with this detail',
    example: 'bookingId',
  })
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @ApiProperty({
    description: 'ID of the position associated with this detail',
    example: 'positionId',
  })
  @IsString()
  @IsNotEmpty()
  positionId: string;

  @ApiProperty({
    description: 'ID of the time slot associated with this detail',
    example: 'timeSlotId',
  })
  @IsString()
  @IsNotEmpty()
  timeSlotId: string;

  @ApiProperty({
    description: 'Duration of the booking in hours',
    example: 1.5,
  })
  @IsNumber()
  duration: number;
}
