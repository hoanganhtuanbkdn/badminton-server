import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingDetail } from './booking-details.entity';
import { CreateBookingDetailDto, UpdateBookingDetailDto } from './dto';

@Injectable()
export class BookingDetailsService {
  constructor(
    @InjectRepository(BookingDetail)
    private bookingDetailsRepository: Repository<BookingDetail>,
  ) { }

  create(createBookingDetailDto: CreateBookingDetailDto): Promise<BookingDetail> {
    const bookingDetail = this.bookingDetailsRepository.create(createBookingDetailDto);
    return this.bookingDetailsRepository.save(bookingDetail);
  }

  findAll(): Promise<BookingDetail[]> {
    return this.bookingDetailsRepository.find();
  }

  findOne(id: string): Promise<BookingDetail> {
    return this.bookingDetailsRepository.findOne({ where: { id } });
  }

  async update(id: string, updateBookingDetailDto: UpdateBookingDetailDto): Promise<BookingDetail> {
    await this.bookingDetailsRepository.update(id, updateBookingDetailDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.bookingDetailsRepository.delete(id);
  }
}
