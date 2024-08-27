import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Booking } from 'src/bookings/bookings.entity';
import { Position } from 'src/positions/positions.entity';
import { TimeSlot } from 'src/timeslots/timeslots.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('booking-details')
export class BookingDetail {
  @ApiProperty({
    description: 'Unique identifier for the booking detail',
    example: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Booking associated with this detail',
    type: () => Booking,
  })
  @ManyToOne(() => Booking, booking => booking.bookingDetails)
  booking: Booking;

  @ApiProperty({
    description: 'Position associated with this detail',
    type: () => Position,
  })
  @ManyToOne(() => Position, position => position.bookingDetails)
  position: Position;

  @ApiProperty({
    description: 'Time slot associated with this detail',
    type: () => TimeSlot,
  })
  @ManyToOne(() => TimeSlot, timeSlot => timeSlot.bookingDetails)
  timeSlot: TimeSlot;

  @ApiProperty({
    description: 'Duration of the booking in hours',
    example: 1.5,
  })
  @Column('decimal')
  duration: number;
}
