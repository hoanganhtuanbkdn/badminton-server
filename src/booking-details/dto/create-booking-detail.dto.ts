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

  @ApiProperty({
    description: 'bookingType: WALK_IN, FIXED',
    example: "WALK_IN",
  })
  bookingType?: string;

  @ApiProperty({
    description: 'bookingDay: 0, 1, 2, 3, 4, 5, 6',
    example: "0",
  })
  bookingDay?: string;

  @ApiProperty({
    description: 'bookingMonth: 5',
    example: "5",
    nullable: true,
  })
  bookingMonth?: string;

  @ApiProperty({
    description: 'The date when the court is booked',
    example: '2024-08-28',
    nullable: true,
  })
  bookingDate: string;
}
