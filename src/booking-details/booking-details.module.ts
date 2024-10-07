import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingDetailsService } from './booking-details.service';
import { BookingDetailsController } from './booking-details.controller';
import { BookingDetail } from './booking-details.entity';
import { Order } from '../orders/orders.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookingDetail, Order])],
  providers: [BookingDetailsService],
  controllers: [BookingDetailsController],
})
export class BookingDetailsModule { }
