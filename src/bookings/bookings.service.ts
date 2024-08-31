import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './bookings.entity';
import { CreateBookingDto, UpdateBookingDto, GetBookingsDto } from './dto';
import { BookingDetail, BookingType } from 'src/booking-details/booking-details.entity';
import { Customer } from 'src/customers/customers.entity';
import { CreateMultipleBookingsDto } from './dto/create-multiple-bookings.dto';
import { TimeSlot } from 'src/timeslots/timeslots.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,

    @InjectRepository(BookingDetail)
    private readonly bookingDetailsRepository: Repository<BookingDetail>,
    @InjectRepository(TimeSlot)
    private readonly timeSlotRepository: Repository<TimeSlot>,

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
      const { customer, bookingDetails, ...bookingData } = createBookingDto;

      console.log(111, customer, bookingDetails, bookingData);
      // Create the booking entity
      const booking = this.bookingsRepository.create({
        ...bookingData,
      });

      // Save the booking to get the ID
      const savedBooking: any = await this.bookingsRepository.save(booking);

      console.log('savedBooking', savedBooking);
      if (customer) {
        const customerEntity = this.customersRepository.create({ ...customer, bookingId: savedBooking.id });
        await this.customersRepository.save(customerEntity);
      }

      // Save booking details if provided
      if (bookingDetails && bookingDetails.length > 0) {
        const bookingDetailsEntities = await Promise.all(bookingDetails.map(async (detail) => {
          const timeSlot = await this.timeSlotRepository.findOne({ where: { id: detail.timeSlotId } });

          let bookingAmount = 0;

          // Calculate the booking amount based on the booking type
          if (detail.bookingType === BookingType.WALK_IN) {
            bookingAmount = timeSlot.walkInFee * detail.duration;
          } else if (detail.bookingType === BookingType.SCHEDULED) {
            bookingAmount = timeSlot.fixedFee * detail.duration;
          }

          return this.bookingDetailsRepository.create({
            ...detail,
            bookingAmount,
            courtId: bookingData.courtId,
            bookingId: savedBooking.id,
          });
        }));
        await this.bookingDetailsRepository.save(bookingDetailsEntities);
      }

      // Return the fully populated booking entity
      return this.bookingsRepository.findOne({
        where: { id: savedBooking.id },
        relations: ['customer', 'bookingDetails', 'bookingDetails.position', 'bookingDetails.timeSlot', 'payments'],
      });
    } catch (e) {
      throw new BadRequestException(e.message);
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
        relations: ['customer', 'court', 'bookingDetails', 'bookingDetails.position', 'bookingDetails.timeSlot', 'payments'],
      });
    } else {
      data = await this.bookingsRepository.find({
        where,
        order: { [sortBy]: sortOrder },
        relations: ['customer', 'court', 'bookingDetails', 'bookingDetails.position', 'bookingDetails.timeSlot', 'payments'],
      });
      total = data.length;
    }

    return { data, total, page, limit };
  }

  // Get a booking by ID
  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['customer', 'court', 'bookingDetails', 'bookingDetails.position', 'bookingDetails.timeSlot', 'payments'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID "${id}" not found`);
    }
    return booking;
  }

  // Update a booking by ID
  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);

    Object.assign(booking, updateBookingDto);
    return this.bookingsRepository.save(booking);
  }

  // Delete a booking by ID
  async remove(id: string): Promise<void> {
    const booking = await this.findOne(id);
    await this.bookingsRepository.delete(booking.id);
  }
}
