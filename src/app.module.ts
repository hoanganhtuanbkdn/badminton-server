import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { configModuleOptions } from './shared/configs/module-options';
import { SharedModule } from './shared/shared.module';
import { OwnersModule } from './owners/owners.module';
import { CourtsModule } from './courts/courts.module';
import { PositionsModule } from './positions/positions.module';
import { TimeSlotsModule } from './timeslots/timeslots.module';
import { CustomersModule } from './customers/customers.module';
import { BookingsModule } from './bookings/bookings.module';
import { BookingDetailsModule } from './booking-details/booking-details.module';
import { PaymentsModule } from './payments/payments.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST, // Redis host
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    SharedModule,
    CacheModule.register({ isGlobal: true }),
    AuthModule,
    ScheduleModule.forRoot(),
    AdminModule,
    HttpModule,
    OwnersModule,
    CourtsModule,
    PositionsModule,
    TimeSlotsModule,
    CustomersModule,
    BookingsModule,
    BookingDetailsModule,
    PaymentsModule,
    VouchersModule,
    OrdersModule,
    ProductsModule,
    ProductCategoriesModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ]
})
export class AppModule { }
