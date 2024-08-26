import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingDetailsService } from './booking-details.service';
import { BookingDetailsController } from './booking-details.controller';
import { BookingDetail } from './booking-details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookingDetail])],
  providers: [BookingDetailsService],
  controllers: [BookingDetailsController],
})
export class BookingDetailsModule { }
