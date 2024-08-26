import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Customer } from 'src/customers/customers.entity';
import { Court } from 'src/courts/courts.entity';
import { BookingDetail } from 'src/booking-details/booking-details.entity';
import { Payment } from 'src/payments/payments.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, customer => customer.bookings)
  customer: Customer;

  @ManyToOne(() => Court, court => court.bookings)
  court: Court;

  @Column({ nullable: true })
  voucher_code: string;

  @Column('decimal')
  total_amount: number;

  @Column()
  payment_status: string;

  @Column({ nullable: true })
  additional_notes: string;

  @Column()
  booking_type: string;

  @Column()
  created_at: Date;

  @OneToMany(() => BookingDetail, bookingDetail => bookingDetail.booking)
  bookingDetails: BookingDetail[];

  @OneToMany(() => Payment, payment => payment.booking)
  payments: Payment[];
}
