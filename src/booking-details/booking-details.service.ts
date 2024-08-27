import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingDetail } from './booking-details.entity';
import { CreateBookingDetailDto, UpdateBookingDetailDto, GetBookingDetailsDto } from './dto';

@Injectable()
export class BookingDetailsService {
  constructor(
    @InjectRepository(BookingDetail)
    private bookingDetailsRepository: Repository<BookingDetail>,
  ) { }

  async create(createBookingDetailDto: CreateBookingDetailDto): Promise<BookingDetail> {
    const bookingDetail = this.bookingDetailsRepository.create(createBookingDetailDto);
    return this.bookingDetailsRepository.save(bookingDetail);
  }

  async findAll(getBookingDetailsDto: GetBookingDetailsDto): Promise<{ data: BookingDetail[]; total: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = getBookingDetailsDto;

    const [data, total] = await this.bookingDetailsRepository.findAndCount({
      relations: ['booking', 'position', 'timeSlot'],
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  async findOne(id: string): Promise<BookingDetail> {
    const bookingDetail = await this.bookingDetailsRepository.findOne({ where: { id }, relations: ['booking', 'position', 'timeSlot'] });
    if (!bookingDetail) {
      throw new NotFoundException(`BookingDetail with ID ${id} not found`);
    }
    return bookingDetail;
  }

  async update(id: string, updateBookingDetailDto: UpdateBookingDetailDto): Promise<BookingDetail> {
    await this.bookingDetailsRepository.update(id, updateBookingDetailDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookingDetailsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`BookingDetail with ID ${id} not found`);
    }
  }
}
