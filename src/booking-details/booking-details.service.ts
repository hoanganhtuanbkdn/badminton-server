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

  async findAll(getBookingDetailsDto: GetBookingDetailsDto): Promise<{ data: BookingDetail[]; total: number, page: number, limit: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', courtId, positionId, ownerId } = getBookingDetailsDto;

    const queryBuilder = this.bookingDetailsRepository.createQueryBuilder('bookingDetail')
      .leftJoinAndSelect('bookingDetail.booking', 'booking')
      .leftJoinAndSelect('bookingDetail.position', 'position')
      .leftJoinAndSelect('bookingDetail.timeSlot', 'timeSlot')
      .leftJoinAndSelect('bookingDetail.court', 'court')
      .leftJoinAndSelect('bookingDetail.owner', 'owner')
      .leftJoinAndSelect('booking.customer', 'customer')
      .leftJoinAndSelect('booking.payments', 'payments')
      .orderBy(`bookingDetail.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    if (courtId) {
      queryBuilder.andWhere('bookingDetail.courtId = :courtId', { courtId });
    }

    if (positionId) {
      queryBuilder.andWhere('bookingDetail.positionId = :positionId', { positionId });
    }

    if (ownerId) {
      queryBuilder.andWhere('bookingDetail.ownerId = :ownerId', { ownerId });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
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
