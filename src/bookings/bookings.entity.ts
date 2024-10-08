import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { Customer } from 'src/customers/customers.entity';
import { Court } from 'src/courts/courts.entity';
import { BookingDetail } from 'src/booking-details/booking-details.entity';
import { Payment } from 'src/payments/payments.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from 'src/orders/orders.entity';

export enum BookingMode {
  BOOK_COURT = 'BOOK_COURT',  // Đặt sân
  JOIN_COURT = 'JOIN_COURT',  // Ghép sân
}

export enum PaymentStatus {
  UNPAID = "UNPAID", // chưa thanh toán
  PAID = "PAID", // đã thanh toán
  HALF_DEPOSITED = "HALF_DEPOSITED", // cọc 50%
}

export enum PaymentType {
  PAY_LATER = "PAY_LATER",
  HALF_DEPOSIT = "HALF_DEPOSIT",
  FULL_PREPAYMENT = "FULL_PREPAYMENT",
}

export enum PaymentMethod {
  NONE = "",
  CASH = "CASH",
  TRANSFER = "TRANSFER",
  CASH_TRANSFER = "CASH_TRANSFER",
}

@Entity('bookings')
export class Booking {
  @ApiProperty({
    description: 'Unique identifier for the booking',
    example: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Voucher code applied to the booking, if any',
    example: 'DISCOUNT10',
    required: false,
  })
  @Column({ name: 'voucher_code', nullable: true })
  voucherCode: string;

  @Column('decimal', {
    name: 'total_amount',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'The total amount before any discounts are applied'
  })
  totalAmount: number;

  @Column('decimal', {
    name: 'final_amount',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'The final amount after discounts are applied'
  })
  finalAmount: number;

  @Column('decimal', {
    name: 'discount_info',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'The discount value applied to the booking'
  })
  discountInfo: number;

  @ApiProperty({
    description: 'Payment method of the booking',
    enum: PaymentMethod,
    example: PaymentMethod.CASH,
  })
  @Column({ name: 'payment_method', type: 'enum', enum: PaymentMethod, nullable: true })
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Payment type of the booking',
    enum: PaymentType,
    example: PaymentType.FULL_PREPAYMENT,
  })
  @Column({ name: 'payment_type', type: 'enum', enum: PaymentType, nullable: true })
  paymentType: PaymentType;

  @ApiProperty({
    description: 'Payment status of the booking',
    enum: PaymentStatus,
    example: PaymentStatus.PAID,
  })
  @Column({ name: 'payment_status', type: 'enum', enum: PaymentStatus, nullable: true })
  paymentStatus: PaymentStatus;

  @ApiProperty({
    description: 'Additional notes for the booking',
    example: 'Please prepare court in advance',
    required: false,
  })
  @Column({ name: 'additional_notes', nullable: true })
  additionalNotes: string;

  @ApiProperty({
    description: 'Booking Code for the booking',
    example: 'VM123456',
    required: false,
  })
  @Column({ name: 'booking_code', nullable: true })
  bookingCode: string;

  @ApiProperty({
    description: 'Payment time',
    required: false,
  })
  @Column({ name: 'payment_at', nullable: true })
  paymentAt: string;

  @ApiProperty({
    description: 'Booking mode (e.g., BOOK_COURT, JOIN_COURT)',
    example: BookingMode.BOOK_COURT,
  })
  @Column({
    type: 'enum',
    enum: BookingMode,
    nullable: true
  })
  bookingMode: BookingMode;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true, default: "" })
  updatedAt: Date;

  @ApiProperty({
    description: 'Customer associated with the booking',
    type: () => Customer,
  })
  @ManyToOne(() => Customer, customer => customer.bookings)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ApiProperty({
    description: 'ID of the customer associated with the booking',
    example: 'uuid',
  })
  @Column({ type: 'uuid', name: 'customer_id', nullable: true })
  customerId: string;

  @ApiProperty({
    description: 'Unique identifier for the court',
    example: 'uuid',
  })
  @Column({ type: 'uuid', name: 'court_id', nullable: true })
  courtId: string;

  @ApiProperty({
    description: 'Court associated with the booking',
    type: () => Court,
  })
  @ManyToOne(() => Court, court => court.bookings)
  @JoinColumn({ name: 'court_id' })  // This is optional, but it helps if you want to customize the column name
  court: Court;

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
