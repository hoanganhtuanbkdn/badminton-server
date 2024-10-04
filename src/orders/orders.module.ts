import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './orders.entity';
import { OrderItem } from '../order-items/order-items.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { BookingsModule } from '../bookings/bookings.module';
import { ProductsModule } from 'src/products/products.module';
import { Product } from 'src/products/products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product]),
    BookingsModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule { }
