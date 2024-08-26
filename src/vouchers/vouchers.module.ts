import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VouchersService } from './vouchers.service';
import { VouchersController } from './vouchers.controller';
import { Voucher } from './vouchers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Voucher])],
  providers: [VouchersService],
  controllers: [VouchersController],
})
export class VouchersModule { }
