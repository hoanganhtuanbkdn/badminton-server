import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn, BeforeInsert } from 'typeorm';
import { Owner } from 'src/owners/owners.entity';
import { Position } from 'src/positions/positions.entity';
import { TimeSlot } from 'src/timeslots/timeslots.entity';
import { Booking } from 'src/bookings/bookings.entity';
import { ApiProperty } from '@nestjs/swagger';
import { slugify } from 'src/shared/utils';
import { BookingDetail } from 'src/booking-details/booking-details.entity';

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

  @Column({ nullable: true })
  slug?: string;

  @ApiProperty({
    description: 'Address of the court',
    example: '123 Main St, City, Country',
  })
  @Column({ name: 'address' })
  address: string;

  @ApiProperty({
    description: 'Geographical coordinates of the court (nullable)',
    example: '40.7128,-74.0060',
    required: false,
  })
  @Column({ name: 'coordinate', nullable: true })
  coordinate?: string;

  @ApiProperty({
    description: 'Phone number for contact (nullable)',
    example: '+1234567890',
    required: false,
  })
  @Column({ name: 'phone_number', nullable: true })
  phoneNumber?: string;

  @ApiProperty({
    description: 'Banner image URL for the court (nullable)',
    example: 'https://example.com/banner.jpg',
    required: false,
  })
  @Column({ name: 'banner_url', nullable: true })
  bannerUrl?: string;

  @OneToMany(() => BookingDetail, bookingDetail => bookingDetail.court)
  bookingDetails: BookingDetail[];

  @ApiProperty({
    description: 'Date when the court was created',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the court was last updated',
    required: false,
  })
  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @ApiProperty({
    description: 'Owner ID of the court',
    example: 'uuid',
  })
  @Column({ name: 'owner_id' })
  ownerId: string;

  @ApiProperty({
    description: 'Owner of the court',
    type: () => Owner,
  })
  @ManyToOne(() => Owner, owner => owner.courts, { nullable: false })
  @JoinColumn({ name: 'owner_id' })
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

  @BeforeInsert()
  generateSlug() {
    this.slug = slugify(this.name);
  }
}
