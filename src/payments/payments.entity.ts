import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Booking } from 'src/bookings/bookings.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Booking, booking => booking.payments)
  booking: Booking;

  @Column()
  payment_method: string;

  @Column()
  account_holder: string;

  @Column()
  bank_name: string;

  @Column()
  account_number: string;

  @Column()
  transaction_id: string;

  @Column('decimal')
  amount: number;

  @Column()
  payment_date: Date;

  @Column()
  payment_status: string;
}
