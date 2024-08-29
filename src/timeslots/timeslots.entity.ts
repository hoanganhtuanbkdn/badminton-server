import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
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
    description: 'Name of the time slot',
  })
  @Column({ name: 'name', nullable: true, })
  name: string;

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
  @Column({ name: 'end_time', nullable: true, })
  endTime: string;

  @ApiProperty({
    description: 'duration',
    example: 1,
  })
  @Column({
    type: 'decimal',
    precision: 3, // Tổng số chữ số
    scale: 1, // Số chữ số sau dấu thập phân
  })
  duration: number;

  @ApiProperty({
    description: 'Fixed fee for booking during this time slot',
    example: 100000,
  })
  @Column({ name: 'fixed_fee', nullable: true, })
  fixedFee: number;

  @ApiProperty({
    description: 'Walk-in fee for booking during this time slot',
    example: 150000,
  })
  @Column({ name: 'walk_in_fee', nullable: true, })
  walkInFee: number;

  @CreateDateColumn({ name: 'created_at', nullable: true, default: "" })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true, default: "" })
  updatedAt: Date;

  @ApiProperty({
    description: 'Court ID associated with this time slot',
    example: 'uuid',
  })
  @Column({ name: 'court_id' })
  courtId: string;

  @ApiProperty({
    description: 'Court associated with this time slot',
    type: () => Court,
  })
  @ManyToOne(() => Court, court => court.timeSlots, { nullable: true })
  @JoinColumn({ name: 'court_id' })
  court: Court;

  @ApiProperty({
    description: 'List of booking details associated with this time slot',
    type: () => [BookingDetail],
  })
  @OneToMany(() => BookingDetail, bookingDetail => bookingDetail.timeSlot)
  bookingDetails: BookingDetail[];

}
