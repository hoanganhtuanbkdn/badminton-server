import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeSlot } from './timeslots.entity';
import { CreateTimeSlotDto, UpdateTimeSlotDto } from './dto';

@Injectable()
export class TimeSlotsService {
  constructor(
    @InjectRepository(TimeSlot)
    private timeSlotsRepository: Repository<TimeSlot>,
  ) { }

  create(createTimeSlotDto: CreateTimeSlotDto): Promise<TimeSlot> {
    const timeSlot = this.timeSlotsRepository.create(createTimeSlotDto);
    return this.timeSlotsRepository.save(timeSlot);
  }

  findAll(): Promise<TimeSlot[]> {
    return this.timeSlotsRepository.find();
  }

  findOne(id: string): Promise<TimeSlot> {
    return this.timeSlotsRepository.findOne({ where: { id } });
  }

  async update(id: string, updateTimeSlotDto: UpdateTimeSlotDto): Promise<TimeSlot> {
    await this.timeSlotsRepository.update(id, updateTimeSlotDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.timeSlotsRepository.delete(id);
  }
}
