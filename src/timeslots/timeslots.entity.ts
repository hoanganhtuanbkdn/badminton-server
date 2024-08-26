import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Court } from 'src/courts/courts.entity';
import { BookingDetail } from 'src/booking-details/booking-details.entity';

@Entity('timeslots')
export class TimeSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  start_time: string;

  @Column()
  end_time: string;

  @Column('decimal')
  fixed_fee: number;

  @Column('decimal')
  walk_in_fee: number;

  @ManyToOne(() => Court, court => court.timeSlots)
  court: Court;

  @OneToMany(() => BookingDetail, bookingDetail => bookingDetail.timeSlot)
  bookingDetails: BookingDetail[];
}
