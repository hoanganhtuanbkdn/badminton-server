import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './bookings.entity';
import { Customer } from 'src/customers/customers.entity';
import { BookingDetail } from 'src/booking-details/booking-details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Customer, BookingDetail])],
  providers: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule { }
