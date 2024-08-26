import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Court } from 'src/courts/courts.entity';
import { BookingDetail } from 'src/booking-details/booking-details.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('timeslots')
export class TimeSlot {
  @ApiProperty({
    description: 'Unique identifier for the time slot',
    example: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Start time of the time slot in HH:mm format',
    example: '08:00',
  })
  @Column({ name: 'start_time' })
  startTime: string;

  @ApiProperty({
    description: 'End time of the time slot in HH:mm format',
    example: '09:30',
  })
  @Column({ name: 'end_time' })
  endTime: string;

  @ApiProperty({
    description: 'Fixed fee for booking during this time slot',
    example: 100000,
  })
  @Column('decimal', { name: 'fixed_fee' })
  fixedFee: number;

  @ApiProperty({
    description: 'Walk-in fee for booking during this time slot',
    example: 150000,
  })
  @Column('decimal', { name: 'walk_in_fee' })
  walkInFee: number;

  @ApiProperty({
    description: 'Court associated with this time slot',
    type: () => Court,
  })
  @ManyToOne(() => Court, court => court.timeSlots)
  court: Court;

  @ApiProperty({
    description: 'List of booking details associated with this time slot',
    type: () => [BookingDetail],
  })
  @OneToMany(() => BookingDetail, bookingDetail => bookingDetail.timeSlot)
  bookingDetails: BookingDetail[];
}
