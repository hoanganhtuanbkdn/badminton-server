import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GuestBookingsService } from './guest-bookings.service';
import { CreateGuestBookingDto } from './dto/create-guest-booking.dto';
import { Booking } from './bookings.entity';

@ApiTags('guest-bookings')
@Controller('guest-bookings')
export class GuestBookingsController {
  constructor(private readonly guestBookingsService: GuestBookingsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new guest booking' })
  @ApiResponse({ status: 201, description: 'The guest booking has been successfully created.', type: Booking })
  createGuestBooking(@Body() createGuestBookingDto: CreateGuestBookingDto): Promise<Booking> {
    return this.guestBookingsService.createGuestBooking(createGuestBookingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a guest booking' })
  @ApiResponse({ status: 200, description: 'The guest booking has been successfully cancelled.' })
  cancelGuestBooking(@Param('id') id: string): Promise<void> {
    return this.guestBookingsService.cancelGuestBooking(id);
  }
}
