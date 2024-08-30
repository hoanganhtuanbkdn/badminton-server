import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Booking } from 'src/bookings/bookings.entity';
import { Position } from 'src/positions/positions.entity';
import { TimeSlot } from 'src/timeslots/timeslots.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Owner } from 'src/owners/owners.entity';
import { Court } from 'src/courts/courts.entity';

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
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @ApiProperty({
    description: 'Booking ID for this detail',
    example: 'uuid',
  })
  @Column({ name: 'booking_id' })
  bookingId: string;

  @ApiProperty({
    description: 'Court associated with this detail',
    type: () => Court,
  })
  @ManyToOne(() => Court, court => court.bookingDetails)
  @JoinColumn({ name: 'court_id' }) // Join column for courtId
  court: Court;

  @ApiProperty({
    description: 'Court ID for this detail',
    example: 'uuid',
  })
  @Column({ name: 'court_id' })
  courtId: string;

  @ApiProperty({
    description: 'Position associated with this detail',
    type: () => Position,
  })
  @ManyToOne(() => Position, position => position.bookingDetails)
  @JoinColumn({ name: 'position_id' }) // Join column for positionId
  position: Position;

  @ApiProperty({
    description: 'Position ID for this detail',
    example: 'uuid',
  })
  @Column({ name: 'position_id' })
  positionId: string;

  @ApiProperty({
    description: 'Owner associated with this detail',
    type: () => Owner,
  })
  @ManyToOne(() => Owner, owner => owner.bookingDetails)
  @JoinColumn({ name: 'owner_id' }) // Join column for ownerId
  owner: Owner;

  @ApiProperty({
    description: 'Owner ID for this detail',
    example: 'uuid',
  })
  @Column({ name: 'owner_id' })
  ownerId: string;

  @ApiProperty({
    description: 'Time slot associated with this detail',
    type: () => TimeSlot,
  })
  @ManyToOne(() => TimeSlot, timeSlot => timeSlot.bookingDetails)
  @JoinColumn({ name: 'time_slot_id' }) // Join column for timeSlotId
  timeSlot: TimeSlot;

  @ApiProperty({
    description: 'Time slot ID for this detail',
    example: 'uuid',
  })
  @Column({ name: 'time_slot_id' })
  timeSlotId: string;

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true, default: "" })
  updatedAt: Date;
}
