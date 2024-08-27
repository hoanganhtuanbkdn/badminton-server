import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeSlot } from './timeslots.entity';
import { CreateTimeSlotDto, UpdateTimeSlotDto, GetTimeSlotsDto } from './dto';

@Injectable()
export class TimeSlotsService {
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
    const { page, limit, sortBy, sortOrder, courtId } = getTimeSlotsDto;

    const queryBuilder = this.timeslotsRepository.createQueryBuilder('timeslot');

    if (courtId) {
      queryBuilder.andWhere('timeslot.courtId = :courtId', { courtId });
    }

    if (sortBy && sortOrder) {
      queryBuilder.orderBy(`timeslot.${sortBy}`, sortOrder);
    }

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
    }

    const [data, total] = await queryBuilder.getManyAndCount();

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
    await this.timeslotsRepository.update(id, updateTimeSlotDto);
    const updatedTimeSlot = await this.timeslotsRepository.findOne({ where: { id } });
    if (!updatedTimeSlot) {
      throw new NotFoundException(`Time slot with ID ${id} not found`);
    }
    return updatedTimeSlot;
  }

  // Delete a timeslot by ID
  async remove(id: string): Promise<void> {
    const result = await this.timeslotsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Time slot with ID ${id} not found`);
    }
  }
}
