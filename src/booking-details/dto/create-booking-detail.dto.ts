import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDetailDto {
  @ApiProperty({
    description: 'ID of the position associated with this detail',
    example: 'positionId',
  })
  @IsString()
  @IsNotEmpty()
  positionId: string;

  @ApiProperty({
    description: 'Duration of the booking in hours',
    example: 1.5,
  })
  @IsNumber()
  duration: number;

  @ApiProperty({
    description: 'bookingType: WALK_IN, SCHEDULED',
    example: "WALK_IN",
  })
  @IsString()
  @IsNotEmpty()
  bookingType?: string;

  @ApiProperty({
    description: 'bookingDay: 0, 1, 2, 3, 4, 5, 6',
    example: "0",
  })
  bookingDay?: string;

  @ApiProperty({
    description: 'bookingMonth: 5',
    example: "5",
  })
  bookingMonth?: string;

  @ApiProperty({
    description: 'The date when the court is booked',
    example: '2024-08-28',
  })
  bookingDate?: string;

  @ApiProperty({
    description: 'The end time for the booking detail',
    example: '10:30',
    nullable: true,
  })
  startTime: string;

  @ApiProperty({
    description: 'The start time for the booking detail',
    example: '11:00',
  })
  endTime: string;

  @ApiProperty({
    description: 'ID của sân liên kết với chi tiết này',
    example: 'courtId',
  })
  @IsString()
  @IsNotEmpty()
  courtId: string;

  @ApiProperty({
    description: 'ID của chủ sân liên kết với chi tiết này',
    example: 'ownerId',
  })
  @IsString()
  @IsOptional()
  ownerId?: string;
}
