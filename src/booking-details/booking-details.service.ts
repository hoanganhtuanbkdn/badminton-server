import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingDetail } from './booking-details.entity';
import { CreateBookingDetailDto, UpdateBookingDetailDto, GetBookingDetailsDto, SortByFields, SortOrder } from './dto';
import { OverviewPeriod } from './dto/get-dashboard-overview.dto';

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
    try {
      const { page = 1, limit = 10, sortBy = SortByFields.CREATED_AT, sortOrder = SortOrder.DESC, courtId, positionId, ownerId, paymentStatus, customerName, startDate, endDate } = getBookingDetailsDto;

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

      if (paymentStatus) {
        queryBuilder.andWhere('booking.paymentStatus = :paymentStatus', { paymentStatus });
      }

      if (customerName) {
        queryBuilder.andWhere('customer.name LIKE :customerName', { customerName: `%${customerName}%` });
      }

      if (startDate && endDate) {
        queryBuilder.andWhere('bookingDetail.bookingDate BETWEEN :startDate AND :endDate', { startDate, endDate });
      } else if (startDate) {
        queryBuilder.andWhere('bookingDetail.bookingDate >= :startDate', { startDate });
      } else if (endDate) {
        queryBuilder.andWhere('bookingDetail.bookingDate <= :endDate', { endDate });
      }

      const [data, total] = await queryBuilder.getManyAndCount();

      return { data, total, page, limit };

    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async getOverview(dto: any) {
    const { period, startDate, endDate } = dto;

    let queryBuilder = this.bookingDetailsRepository.createQueryBuilder('bookingDetail')
      .leftJoin('bookingDetail.booking', 'booking')
      .leftJoin('booking.customer', 'customer')
      .select([
        'COUNT(bookingDetail.id) as totalBookingDetails',
        'SUM(booking.finalAmount) as totalBookingAmount',
        'SUM(CASE WHEN booking.paymentStatus = \'Paid\' THEN booking.finalAmount ELSE 0 END) as totalPaidAmount',
        'SUM(CASE WHEN booking.paymentStatus != \'Paid\' THEN booking.finalAmount ELSE 0 END) as totalUnpaidAmount',
        'SUM(CASE WHEN booking.paymentStatus = \'Paid\' THEN 1 ELSE 0 END) as paidCount',
        'SUM(CASE WHEN booking.paymentStatus != \'Paid\' THEN 1 ELSE 0 END) as unpaidCount',
        'COUNT(DISTINCT customer.id) as totalCustomers'
      ]);

    switch (period) {
      case OverviewPeriod.TODAY:
        queryBuilder = queryBuilder.where('DATE(bookingDetail.createdAt) = CURRENT_DATE');
        break;
      case OverviewPeriod.THIS_WEEK:
        queryBuilder = queryBuilder.where('EXTRACT(WEEK FROM bookingDetail.createdAt) = EXTRACT(WEEK FROM CURRENT_DATE)')
          .andWhere('EXTRACT(YEAR FROM bookingDetail.createdAt) = EXTRACT(YEAR FROM CURRENT_DATE)');
        break;
      case OverviewPeriod.THIS_MONTH:
        queryBuilder = queryBuilder.where('EXTRACT(MONTH FROM bookingDetail.createdAt) = EXTRACT(MONTH FROM CURRENT_DATE)')
          .andWhere('EXTRACT(YEAR FROM bookingDetail.createdAt) = EXTRACT(YEAR FROM CURRENT_DATE)');
        break;
      case OverviewPeriod.THIS_QUARTER:
        queryBuilder = queryBuilder.where('EXTRACT(QUARTER FROM bookingDetail.createdAt) = EXTRACT(QUARTER FROM CURRENT_DATE)')
          .andWhere('EXTRACT(YEAR FROM bookingDetail.createdAt) = EXTRACT(YEAR FROM CURRENT_DATE)');
        break;
      case OverviewPeriod.CUSTOM:
        if (startDate && endDate) {
          queryBuilder = queryBuilder.where('bookingDetail.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
        } else {
          throw new BadRequestException('Start date and end date are required for custom period');
        }
        break;
      default:
        throw new BadRequestException('Invalid period provided');
    }

    const overviewData = await queryBuilder.getRawOne();

    return {
      paidCount: overviewData?.paidcount,
      totalBookingAmount: overviewData?.totalbookingamount,
      totalBookingDetails: overviewData?.totalbookingdetails,
      totalCustomers: overviewData?.totalcustomers,
      totalPaidAmount: overviewData?.totalpaidamount,
      totalUnpaidAmount: overviewData?.totalunpaidamount,
      unpaidCount: overviewData?.unpaidcount,
    };
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
