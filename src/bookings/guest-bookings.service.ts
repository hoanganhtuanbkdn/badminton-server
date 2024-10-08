import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingMode, PaymentStatus } from './bookings.entity';
import { CreateGuestBookingDto } from './dto/create-guest-booking.dto';
import { Customer } from 'src/customers/customers.entity';
import { BookingDetail, BookingType } from 'src/booking-details/booking-details.entity';
import { Court } from 'src/courts/courts.entity';

@Injectable()
export class GuestBookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
    @InjectRepository(BookingDetail)
    private bookingDetailsRepository: Repository<BookingDetail>,
    @InjectRepository(Court)
    private courtsRepository: Repository<Court>,
  ) { }

  async createGuestBooking(createGuestBookingDto: CreateGuestBookingDto): Promise<Booking> {
    const { courtId, totalAmount, guestName, guestPhone, guestEmail, bookingDetails, ...bookingData } = createGuestBookingDto;

    const court = await this.courtsRepository.findOne({ where: { id: courtId } });
    if (!court) {
      throw new NotFoundException(`Court with ID "${courtId}" not found`);
    }

    // Create or find the customer
    let customer = await this.customersRepository.findOne({
      where: {
        name: guestName,
        phoneNumber: guestPhone
      }
    });

    if (!customer) {
      customer = this.customersRepository.create({
        name: guestName,
        phoneNumber: guestPhone,
        email: guestEmail,
      });
      customer = await this.customersRepository.save(customer);
    }

    // Create the booking
    const booking = this.bookingsRepository.create({
      ...bookingData,
      courtId,
      totalAmount,
      customerId: customer.id,
      bookingMode: BookingMode.BOOK_COURT,
    });

    const savedBooking = await this.bookingsRepository.save(booking);

    // Create booking details
    if (bookingDetails && bookingDetails.length > 0) {
      const bookingDetailsEntities = bookingDetails.map(detail => {
        const bookingAmount = detail.bookingType === BookingType.WALK_IN
          ? Number(court.walkInFee || 0) * Number(detail.duration || 0)
          : Number(court.fixedFee || 0) * Number(detail.duration || 0);

        return this.bookingDetailsRepository.create({
          ...detail,
          bookingAmount,
          courtId,
          bookingId: savedBooking.id,
        });
      });
      await this.bookingDetailsRepository.save(bookingDetailsEntities);
    }

    return this.bookingsRepository.findOne({
      where: { id: savedBooking.id },
      relations: ['customer', 'court', 'bookingDetails'],
    });
  }

  async cancelGuestBooking(id: string): Promise<void> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['bookingDetails'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID "${id}" not found`);
    }

    if (booking.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Cannot cancel a paid booking');
    }

    // Delete associated booking details
    if (booking.bookingDetails) {
      await this.bookingDetailsRepository.remove(booking.bookingDetails);
    }

    // Delete the booking
    await this.bookingsRepository.remove(booking);
  }
}
