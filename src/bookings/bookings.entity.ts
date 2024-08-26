import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Customer } from 'src/customers/customers.entity';
import { Court } from 'src/courts/courts.entity';
import { BookingDetail } from 'src/booking-details/booking-details.entity';
import { Payment } from 'src/payments/payments.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('bookings')
export class Booking {
  @ApiProperty({
    description: 'Unique identifier for the booking',
    example: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Customer associated with the booking',
    type: () => Customer,
  })
  @ManyToOne(() => Customer, customer => customer.bookings)
  customer: Customer;

  @ApiProperty({
    description: 'Court associated with the booking',
    type: () => Court,
  })
  @ManyToOne(() => Court, court => court.bookings)
  court: Court;

  @ApiProperty({
    description: 'Voucher code applied to the booking, if any',
    example: 'DISCOUNT10',
    required: false,
  })
  @Column({ name: 'voucher_code', nullable: true })
  voucherCode: string;

  @ApiProperty({
    description: 'Total amount for the booking',
    example: 150000,
  })
  @Column('decimal', { name: 'total_amount' })
  totalAmount: number;

  @ApiProperty({
    description: 'Payment status of the booking',
    example: 'Paid',
  })
  @Column({ name: 'payment_status' })
  paymentStatus: string;

  @ApiProperty({
    description: 'Additional notes for the booking',
    example: 'Please prepare court in advance',
    required: false,
  })
  @Column({ name: 'additional_notes', nullable: true })
  additionalNotes: string;

  @ApiProperty({
    description: 'Type of booking (e.g., Scheduled, Flexible)',
    example: 'Scheduled',
  })
  @Column({ name: 'booking_type' })
  bookingType: string;

  @ApiProperty({
    description: 'Creation date of the booking',
    example: '2024-08-24T14:48:00.000Z',
  })
  @Column({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'List of booking details associated with this booking',
    type: () => [BookingDetail],
  })
  @OneToMany(() => BookingDetail, bookingDetail => bookingDetail.booking)
  bookingDetails: BookingDetail[];

  @ApiProperty({
    description: 'List of payments associated with this booking',
    type: () => [Payment],
  })
  @OneToMany(() => Payment, payment => payment.booking)
  payments: Payment[];
}
