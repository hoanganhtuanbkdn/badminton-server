import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateBookingDetailDto } from 'src/booking-details/dto';

export class CreateGuestBookingDto {
  @ApiProperty({
    description: 'ID of the court being booked',
    example: 'courtId',
  })
  @IsString()
  @IsNotEmpty()
  courtId: string;

  @ApiProperty({
    description: 'Total amount for the booking',
    example: 150000,
  })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({
    description: 'Guest name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  guestName: string;

  @ApiProperty({
    description: 'Guest phone number',
    example: '0123456789',
  })
  @IsString()
  @IsNotEmpty()
  guestPhone: string;

  @ApiProperty({
    description: 'Guest email',
    example: 'john@example.com',
  })
  @IsString()
  @IsOptional()
  guestEmail?: string;

  @ApiProperty({
    description: 'Details of the booking, including positions and time slots',
    type: [CreateBookingDetailDto],
  })
  @ValidateNested({ each: true })
  @Type(() => CreateBookingDetailDto)
  @IsArray()
  bookingDetails: CreateBookingDetailDto[];

  // Add other necessary fields similar to CreateBookingDto
  // but tailored for guest bookings
}
