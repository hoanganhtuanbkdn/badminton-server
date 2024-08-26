import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Booking } from 'src/bookings/bookings.entity';
import { Position } from 'src/positions/positions.entity';
import { TimeSlot } from 'src/timeslots/timeslots.entity';

@Entity('booking-details')
export class BookingDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Booking, booking => booking.bookingDetails)
  booking: Booking;

  @ManyToOne(() => Position, position => position.bookingDetails)
  position: Position;

  @ManyToOne(() => TimeSlot, timeSlot => timeSlot.bookingDetails)
  timeSlot: TimeSlot;

  @Column('decimal')
  duration: number;
}
