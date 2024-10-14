import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Booking } from './bookings.entity';
import { CreateBookingDto, UpdateBookingDto, GetBookingsDto } from './dto';
import { BookingDetail, BookingType } from 'src/booking-details/booking-details.entity';
import { Customer } from 'src/customers/customers.entity';
import { CreateMultipleBookingsDto } from './dto/create-multiple-bookings.dto';
import { TimeSlot } from 'src/timeslots/timeslots.entity';
import { Voucher } from 'src/vouchers/vouchers.entity';
import { Court } from 'src/courts/courts.entity';
import { GetDashboardOverviewDto, OverviewPeriod } from '../booking-details/dto/get-dashboard-overview.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Court)
    private courtsRepository: Repository<Court>,
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,

    @InjectRepository(BookingDetail)
    private readonly bookingDetailsRepository: Repository<BookingDetail>,

    @InjectRepository(Voucher)
    private vouchersRepository: Repository<Voucher>,
  ) { }

  async createMultiple(createMultipleBookingsDto: any): Promise<Booking[]> {
    const bookings = await Promise.all(
      createMultipleBookingsDto.bookings.map(createBookingDto =>
        this.create(createBookingDto),
      ),
    );
    return bookings;
  }

  // Create a new booking
  async create(createBookingDto: any): Promise<Booking> {
    try {
      const { customer, bookingDetails, voucherCode, ...bookingData } = createBookingDto;

      // Create the booking entity
      const booking = this.bookingsRepository.create({
        ...bookingData,
      });

      // Save the booking to get the ID
      const savedBooking: any = await this.bookingsRepository.save(booking);

      if (customer) {
        let existingCustomer;
        if (customer.phoneNumber) {
          existingCustomer = await this.customersRepository.findOne({
            where: { name: customer.name, phoneNumber: customer.phoneNumber }
          });
        } else {
          existingCustomer = await this.customersRepository.findOne({
            where: { name: customer.name }
          });
        }

        if (existingCustomer) {
          // Update existing customer with new booking
          savedBooking.customerId = existingCustomer.id;
          await this.bookingsRepository.save(savedBooking);
        } else {
          // Create new customer
          const customerEntity = this.customersRepository.create(customer);
          const savedCustomer = await this.customersRepository.save(customerEntity) as unknown as Customer;
          savedBooking.customerId = savedCustomer.id;
          await this.bookingsRepository.save(savedBooking);
        }
      }

      // Calculate the total amount based on booking details
      let totalAmount = 0;

      const court = await this.courtsRepository.findOne({
        where: {
          id: bookingData.courtId
        }
      });

      if (!court) {
        throw new NotFoundException(`Court with ID "${bookingData.courtId}" not found`);
      }

      if (bookingDetails && bookingDetails.length > 0) {
        const bookingDetailsEntities = await Promise.all(
          bookingDetails.map(async (detail) => {

            let bookingAmount = 0;

            // Calculate the booking amount based on the booking type
            if (detail.bookingType === BookingType.WALK_IN) {
              bookingAmount = Number(court.walkInFee || 0) * Number(detail.duration || 0);
            } else if (detail.bookingType === BookingType.SCHEDULED) {
              bookingAmount = Number(court.fixedFee || 0) * Number(detail.duration || 0);
            }

            totalAmount += bookingAmount;

            return this.bookingDetailsRepository.create({
              ...detail,
              bookingAmount,
              courtId: bookingData.courtId,
              bookingId: savedBooking.id,
            });
          }),
        );
        await this.bookingDetailsRepository.save(bookingDetailsEntities);
      }

      // Apply voucher code if provided
      let discountInfo = 0;

      if (voucherCode) {
        const voucher = await this.vouchersRepository.findOne({ where: { code: voucherCode } });

        if (voucher) {
          const currentDate = new Date();

          // Check if the voucher is valid based on validFrom, validUntil, and availableUsage
          const isValidFrom = voucher.validFrom ? new Date(voucher.validFrom) <= currentDate : true;
          const isValidUntil = voucher.validUntil ? new Date(voucher.validUntil) >= currentDate : true;
          const isAvailableUsage = voucher.availableUsage !== undefined ? voucher.availableUsage > 0 : true;

          if (isValidFrom && isValidUntil && isAvailableUsage) {
            if (voucher.discountPercentage > 0) {
              discountInfo = (totalAmount * voucher.discountPercentage) / 100;
            } else if (voucher.discountValue > 0) {
              discountInfo = voucher.discountValue;
            }

            discountInfo = Math.min(discountInfo, totalAmount); // Ensure discount doesn't exceed total amount

            // Decrement the availableUsage if applicable
            if (voucher.availableUsage !== undefined) {
              voucher.availableUsage -= 1;
              await this.vouchersRepository.save(voucher);
            }
          }
        }
      }

      const finalAmount = totalAmount - discountInfo;

      // Update the booking with total amount, final amount, and discount info
      await this.bookingsRepository.update(savedBooking.id, {
        totalAmount,
        finalAmount,
        discountInfo,
      });

      // Return the fully populated booking entity
      return this.bookingsRepository.findOne({
        where: { id: savedBooking.id },
        relations: ['customer', 'bookingDetails', 'bookingDetails.position', 'payments'],
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async recalculateOldBookings(): Promise<void> {
    try {
      // Fetch all bookings with null values in the fields that need recalculation
      const bookingsToUpdate = await this.bookingsRepository.find({
        relations: ['bookingDetails', 'customer'],
      });

      for (const booking of bookingsToUpdate) {
        let totalAmount = 0;
        let finalAmount = 0;
        let discountInfo = 0;

        // Recalculate totalAmount based on bookingDetails
        for (const detail of booking.bookingDetails) {
          const court = await this.courtsRepository.findOne({
            where: {
              id: detail.courtId
            }
          });
          const bookingAmount = detail.bookingType === BookingType.WALK_IN
            ? court.walkInFee * detail.duration
            : court.fixedFee * detail.duration;

          totalAmount += bookingAmount;
        }

        console.log('totalAmount', totalAmount);

        // Apply voucher if available
        if (booking.voucherCode) {
          const voucher = await this.vouchersRepository.findOne({ where: { code: booking.voucherCode } });

          if (voucher) {
            const currentDate = new Date();
            const isValidFrom = voucher.validFrom ? new Date(voucher.validFrom) <= currentDate : true;
            const isValidUntil = voucher.validUntil ? new Date(voucher.validUntil) >= currentDate : true;
            const isAvailableUsage = voucher.availableUsage !== undefined ? voucher.availableUsage > 0 : true;

            if (isValidFrom && isValidUntil && isAvailableUsage) {
              if (voucher.discountPercentage > 0) {
                discountInfo = (totalAmount * voucher.discountPercentage) / 100;
              } else if (voucher.discountValue > 0) {
                discountInfo = voucher.discountValue;
              }

              discountInfo = Math.min(discountInfo, totalAmount);
              finalAmount = totalAmount - discountInfo;

              // Decrement the availableUsage if applicable
              if (voucher.availableUsage !== undefined) {
                voucher.availableUsage -= 1;
                await this.vouchersRepository.save(voucher);
              }
            }
          }
        } else {
          finalAmount = totalAmount;
        }

        // Update the booking with the recalculated values
        booking.totalAmount = totalAmount;
        booking.finalAmount = finalAmount;
        booking.discountInfo = discountInfo;

        await this.bookingsRepository.save(booking);
      }
    } catch (e) {
      throw new BadRequestException(`Error recalculating bookings: ${e.message}`);
    }
  }

  // Get all bookings with pagination, sorting, and filtering
  async findAll(getBookingsDto: GetBookingsDto): Promise<{ data: Booking[]; total: number; page?: number; limit?: number }> {
    const { page, limit, sortBy = 'createdAt', sortOrder = 'DESC', customerId, courtId } = getBookingsDto;

    const where: any = {};
    if (customerId) where.customerId = customerId;
    if (courtId) where.courtId = courtId;

    let data: Booking[];
    let total: number;

    if (page && limit) {
      [data, total] = await this.bookingsRepository.findAndCount({
        where,
        order: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        relations: ['customer', 'court', 'bookingDetails', 'bookingDetails.position', 'payments'],
      });
    } else {
      data = await this.bookingsRepository.find({
        where,
        order: { [sortBy]: sortOrder },
        relations: ['customer', 'court', 'bookingDetails', 'bookingDetails.position', 'payments'],
      });
      total = data.length;
    }

    return { data, total, page, limit };
  }

  // Get a booking by ID
  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['customer', 'court', 'bookingDetails', 'bookingDetails.position', 'payments'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID "${id}" not found`);
    }
    return booking;
  }

  // Update a booking by ID
  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);
    const { customer, bookingDetails, voucherCode, ...bookingData } = updateBookingDto;

    // Update customer if provided
    if (customer) {
      let existingCustomer = await this.customersRepository.findOne({
        where: { name: customer.name, phoneNumber: customer.phoneNumber }
      });

      if (!existingCustomer) {
        existingCustomer = this.customersRepository.create(customer);
        existingCustomer = await this.customersRepository.save(existingCustomer);
      }

      booking.customerId = existingCustomer.id;
    }

    // Update booking details if provided
    if (bookingDetails?.length > 0) {
      // Remove existing booking details
      await this.bookingDetailsRepository.delete({ bookingId: booking.id });

      const court = await this.courtsRepository.findOne({
        where: { id: booking.courtId }
      });

      let totalAmount = 0;

      const newBookingDetails = await Promise.all(
        bookingDetails.map(async (detail) => {
          let bookingAmount = 0;

          if (detail.bookingType === BookingType.WALK_IN) {
            bookingAmount = Number(court.walkInFee || 0) * Number(detail.duration || 0);
          } else if (detail.bookingType === BookingType.SCHEDULED) {
            bookingAmount = Number(court.fixedFee || 0) * Number(detail.duration || 0);
          }

          totalAmount += bookingAmount;

          return this.bookingDetailsRepository.create({
            ...detail,
            bookingAmount,
            courtId: booking.courtId,
            bookingId: booking.id,
          });
        })
      );

      await this.bookingDetailsRepository.save(newBookingDetails);
      booking.totalAmount = totalAmount;
    }

    // Apply new voucher code if provided
    if (voucherCode) {
      const voucher = await this.vouchersRepository.findOne({ where: { code: voucherCode } });

      if (voucher) {
        const currentDate = new Date();
        const isValidFrom = voucher.validFrom ? new Date(voucher.validFrom) <= currentDate : true;
        const isValidUntil = voucher.validUntil ? new Date(voucher.validUntil) >= currentDate : true;
        const isAvailableUsage = voucher.availableUsage !== undefined ? voucher.availableUsage > 0 : true;

        if (isValidFrom && isValidUntil && isAvailableUsage) {
          let discountInfo = 0;

          if (voucher.discountPercentage > 0) {
            discountInfo = (booking.totalAmount * voucher.discountPercentage) / 100;
          } else if (voucher.discountValue > 0) {
            discountInfo = voucher.discountValue;
          }

          discountInfo = Math.min(discountInfo, booking.totalAmount);
          booking.finalAmount = booking.totalAmount - discountInfo;
          booking.discountInfo = discountInfo;
          booking.voucherCode = voucherCode;

          if (voucher.availableUsage !== undefined) {
            voucher.availableUsage -= 1;
            await this.vouchersRepository.save(voucher);
          }
        }
      }
    }

    // Update other booking data
    Object.assign(booking, bookingData);

    // Save the updated booking
    const updatedBooking = await this.bookingsRepository.save(booking);

    // Return the fully populated updated booking entity
    return this.bookingsRepository.findOne({
      where: { id: updatedBooking.id },
      relations: ['customer', 'bookingDetails', 'bookingDetails.position', 'payments'],
    });
  }

  // Delete a booking by ID
  async remove(id: string): Promise<void> {
    const booking = await this.findOne(id);
    await this.bookingsRepository.delete(booking.id);
  }

  async getOverview(getDashboardOverviewDto: any) {
    const { period, startDate, endDate } = getDashboardOverviewDto;

    let queryBuilder = this.bookingsRepository.createQueryBuilder('booking')
      .leftJoin('booking.customer', 'customer')
      .select([
        'COUNT(booking.id) as totalBooking',
        'SUM(booking.finalAmount) as totalBookingAmount',
        'SUM(CASE WHEN booking.paymentStatus = \'PAID\' THEN booking.finalAmount ELSE 0 END) as totalPaidAmount',
        'SUM(CASE WHEN booking.paymentStatus != \'PAID\' THEN booking.finalAmount ELSE 0 END) as totalUnpaidAmount',
        'SUM(CASE WHEN booking.paymentStatus = \'PAID\' THEN 1 ELSE 0 END) as paidCount',
        'SUM(CASE WHEN booking.paymentStatus != \'PAID\' THEN 1 ELSE 0 END) as unpaidCount',
        'COUNT(DISTINCT customer.id) as totalCustomers'
      ]);

    // Calculate date range based on period
    switch (period) {
      case OverviewPeriod.TODAY:
        queryBuilder = queryBuilder.where('DATE(booking.createdAt) = CURRENT_DATE');
        break;
      case OverviewPeriod.THIS_WEEK:
        queryBuilder = queryBuilder.where('EXTRACT(WEEK FROM booking.createdAt) = EXTRACT(WEEK FROM CURRENT_DATE)')
          .andWhere('EXTRACT(YEAR FROM booking.createdAt) = EXTRACT(YEAR FROM CURRENT_DATE)');
        break;
      case OverviewPeriod.THIS_MONTH:
        queryBuilder = queryBuilder.where('EXTRACT(MONTH FROM booking.createdAt) = EXTRACT(MONTH FROM CURRENT_DATE)')
          .andWhere('EXTRACT(YEAR FROM booking.createdAt) = EXTRACT(YEAR FROM CURRENT_DATE)');
        break;
      case OverviewPeriod.THIS_QUARTER:
        queryBuilder = queryBuilder.where('EXTRACT(QUARTER FROM booking.createdAt) = EXTRACT(QUARTER FROM CURRENT_DATE)')
          .andWhere('EXTRACT(YEAR FROM booking.createdAt) = EXTRACT(YEAR FROM CURRENT_DATE)');
        break;
      case OverviewPeriod.CUSTOM:
        if (startDate && endDate) {
          queryBuilder = queryBuilder.where('booking.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
        } else {
          throw new BadRequestException('Start date and end date are required for custom period');
        }
        break;
      case OverviewPeriod.ALL:
        // No additional where clause needed for all data
        // Fetch all data without any date restrictions
        queryBuilder = queryBuilder.where('');
        break;
      default:
        throw new BadRequestException('Invalid period provided');
    }

    const overviewData = await queryBuilder.getRawOne();

    return {
      paidCount: overviewData?.paidcount,
      totalBookingAmount: overviewData?.totalbookingamount,
      totalBooking: overviewData?.totalbooking,
      totalCustomers: overviewData?.totalcustomers,
      totalPaidAmount: overviewData?.totalpaidamount,
      totalUnpaidAmount: overviewData?.totalunpaidamount,
      unpaidCount: overviewData?.unpaidcount,
    };
  }

}
