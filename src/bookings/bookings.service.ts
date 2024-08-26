import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './bookings.entity';
import { CreateBookingDto, UpdateBookingDto } from './dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) { }

  create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const booking = this.bookingsRepository.create(createBookingDto);
    return this.bookingsRepository.save(booking);
  }

  findAll(): Promise<Booking[]> {
    return this.bookingsRepository.find();
  }

  findOne(id: string): Promise<Booking> {
    return this.bookingsRepository.findOne({ where: { id } });
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    await this.bookingsRepository.update(id, updateBookingDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.bookingsRepository.delete(id);
  }
}
