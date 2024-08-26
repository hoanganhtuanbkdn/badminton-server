import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Booking } from 'src/bookings/bookings.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phone_number: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  notes: string;

  @OneToMany(() => Booking, booking => booking.customer)
  bookings: Booking[];
}
