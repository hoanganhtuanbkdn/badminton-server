import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './bookings.entity';
import { Customer } from 'src/customers/customers.entity';
import { BookingDetail } from 'src/booking-details/booking-details.entity';
import { TimeSlot } from 'src/timeslots/timeslots.entity';
import { Voucher } from 'src/vouchers/vouchers.entity';
import { Court } from 'src/courts/courts.entity';
import { GuestBookingsController } from './guest-bookings.controller';
import { GuestBookingsService } from './guest-bookings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Court, Customer, BookingDetail, Voucher]),
  ],
  controllers: [BookingsController, GuestBookingsController],
  providers: [BookingsService, GuestBookingsService],
  exports: [BookingsService],
})
export class BookingsModule { }
