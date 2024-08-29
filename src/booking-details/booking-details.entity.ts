import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from 'src/bookings/bookings.entity';
import { Position } from 'src/positions/positions.entity';
import { TimeSlot } from 'src/timeslots/timeslots.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum BookingType {
  WALK_IN = 'WALK_IN', // Vãng lai
  SCHEDULED = 'SCHEDULED', // Cố định
}

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
  @JoinColumn({ name: 'booking_id' }) // Thêm JoinColumn để liên kết với bookingId
  booking: Booking;

  @ApiProperty({
    description: 'Booking ID for this detail',
    example: 'uuid',
  })
  @Column({ name: 'booking_id' })
  bookingId: string;

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
  @Column({
    type: 'decimal',
    precision: 3, // Tổng số chữ số
    scale: 1, // Số chữ số sau dấu thập phân
  })
  duration: number;

  @ApiProperty({
    description: 'Type of booking: WALK_IN, SCHEDULED',
    example: BookingType.SCHEDULED,
  })
  @Column({
    name: 'booking_type',
  })
  bookingType?: string;

  @ApiProperty({
    description: 'bookingDay: 0, 1, 2, 3, 4, 5, 6',
    example: "0",
  })
  @Column({
    name: 'booking_day',
    nullable: true,
  })
  bookingDay?: string;

  @ApiProperty({
    description: 'bookingMonth: 5',
    example: "5",
    nullable: true,
  })
  @Column({
    name: 'booking_month',
  })
  bookingMonth?: string;

  @ApiProperty({
    description: 'The date when the court is booked',
    example: '2024-08-28',
    nullable: true,
  })
  @Column({ name: "booking_date" })
  bookingDate: string;
}
