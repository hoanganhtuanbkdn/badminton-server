import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Owner } from 'src/owners/owners.entity';
import { Position } from 'src/positions/positions.entity';
import { TimeSlot } from 'src/timeslots/timeslots.entity';
import { Booking } from 'src/bookings/bookings.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('courts')
export class Court {
  @ApiProperty({
    description: 'Unique identifier for the court',
    example: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Name of the court',
    example: 'Court 1',
  })
  @Column({ name: 'name' })
  name: string;

  @ApiProperty({
    description: 'Address of the court',
    example: '123 Main St, City, Country',
  })
  @Column({ name: 'address' })
  address: string;

  @ApiProperty({
    description: 'Geographical coordinates of the court',
    example: '40.7128,-74.0060',
  })
  @Column({ name: 'coordinate' })
  coordinate: string;

  @ApiProperty({
    description: 'Phone number for contact',
    example: '+1234567890',
  })
  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @ApiProperty({
    description: 'Banner image URL for the court',
    example: 'https://example.com/banner.jpg',
  })
  @Column({ name: 'banner' })
  bannerUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true, default: "" })
  updatedAt: Date;

  @ApiProperty({
    description: 'Owner of the court',
    type: () => Owner,
  })
  @ManyToOne(() => Owner, owner => owner.courts)
  owner: Owner;

  @ApiProperty({
    description: 'List of positions associated with this court',
    type: () => [Position],
  })
  @OneToMany(() => Position, position => position.court)
  positions: Position[];

  @ApiProperty({
    description: 'List of time slots associated with this court',
    type: () => [TimeSlot],
  })
  @OneToMany(() => TimeSlot, timeSlot => timeSlot.court)
  timeSlots: TimeSlot[];

  @ApiProperty({
    description: 'List of bookings associated with this court',
    type: () => [Booking],
  })
  @OneToMany(() => Booking, booking => booking.court)
  bookings: Booking[];
}
