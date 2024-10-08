import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './orders.entity';
import { OrderItem } from '../order-items/order-items.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { BookingsModule } from '../bookings/bookings.module';
import { ProductsModule } from 'src/products/products.module';
import { Product } from 'src/products/products.entity';
import { BookingDetailsModule } from 'src/booking-details/booking-details.module';
import { BookingDetail } from 'src/booking-details/booking-details.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product, BookingDetail]),
    BookingsModule,
    BookingDetailsModule
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule { }
