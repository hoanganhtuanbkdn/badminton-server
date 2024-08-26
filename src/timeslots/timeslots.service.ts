import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeSlot } from './timeslots.entity';
import { CreateTimeSlotDto, UpdateTimeSlotDto, GetTimeSlotsDto } from './dto';

@Injectable()
export class TimeslotsService {
  constructor(
    @InjectRepository(TimeSlot)
    private timeslotsRepository: Repository<TimeSlot>,
  ) { }

  // Create a new timeslot
  async create(createTimeSlotDto: CreateTimeSlotDto): Promise<TimeSlot> {
    const timeslot = this.timeslotsRepository.create(createTimeSlotDto);
    return this.timeslotsRepository.save(timeslot);
  }

  // Get all timeslots with pagination, sorting, and filtering
  async findAll(getTimeSlotsDto: GetTimeSlotsDto): Promise<{ data: TimeSlot[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', unitId } = getTimeSlotsDto;

    const where: any = {};
    if (unitId) where.unitId = unitId;

    const [data, total] = await this.timeslotsRepository.findAndCount({
      where,
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  // Get a timeslot by ID
  async findOne(id: string): Promise<TimeSlot> {
    const timeslot = await this.timeslotsRepository.findOne({ where: { id } });
    if (!timeslot) {
      throw new NotFoundException(`TimeSlot with ID "${id}" not found`);
    }
    return timeslot;
  }

  // Update a timeslot by ID
  async update(id: string, updateTimeSlotDto: UpdateTimeSlotDto): Promise<TimeSlot> {
    const timeslot = await this.findOne(id);

    Object.assign(timeslot, updateTimeSlotDto);
    return this.timeslotsRepository.save(timeslot);
  }

  // Delete a timeslot by ID
  async remove(id: string): Promise<void> {
    const timeslot = await this.findOne(id);
    await this.timeslotsRepository.delete(timeslot.id);
  }
}
