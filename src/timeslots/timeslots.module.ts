import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSlotsService } from './timeslots.service';
import { TimeSlotsController } from './timeslots.controller';
import { TimeSlot } from './timeslots.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TimeSlot])],
  providers: [TimeSlotsService],
  controllers: [TimeSlotsController],
})
export class TimeSlotsModule { }
