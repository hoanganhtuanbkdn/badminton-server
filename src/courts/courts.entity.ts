import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn, BeforeInsert } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Owner } from 'src/owners/owners.entity';
import { Position } from 'src/positions/positions.entity';
import { TimeSlot } from 'src/timeslots/timeslots.entity';
import { Booking } from 'src/bookings/bookings.entity';
import { BookingDetail } from 'src/booking-details/booking-details.entity';
import { slugify } from 'src/shared/utils';
import { Product } from 'src/products/products.entity';
import { ProductCategory } from 'src/product-categories/product-categories.entity';
import { Order } from 'src/orders/orders.entity';

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
    description: 'Latitude of the court',
    example: 21.028511,
  })
  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  latitude: number;

  @ApiProperty({
    description: 'Longitude of the court',
    example: 105.804817,
  })
  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  longitude: number;

  @ApiProperty({
    description: 'Distance to the court',
    example: 1000,
    nullable: true,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  distance?: number;

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

  @ApiProperty({
    description: 'Banner image URL for the court (nullable)',
    example: 'https://example.com/banner.jpg',
    required: false,
  })
  @Column({ name: 'logo_url', nullable: true })
  logoUrl?: string;

  @ApiProperty({
    description: 'duration',
    example: 1,
  })
  @Column({
    type: 'decimal',
    precision: 3,
    scale: 1,
    nullable: true,
    default: 0.5
  })
  duration: number;

  @ApiProperty({
    description: 'Fixed fee for booking during weekdays',
    example: 100000,
  })
  @Column({ name: 'fixed_fee', nullable: true, default: 0 })
  fixedFee: number;

  @ApiProperty({
    description: 'Walk-in fee for booking during weekdays',
    example: 150000,
  })
  @Column({ name: 'walk_in_fee', nullable: true, default: 0 })
  walkInFee: number;

  @ApiProperty({
    description: 'Fixed fee for booking during weekends',
    example: 120000,
  })
  @Column({ name: 'weekend_fixed_fee', nullable: true, default: 0 })
  weekendFixedFee: number;

  @ApiProperty({
    description: 'Walk-in fee for booking during weekends',
    example: 180000,
  })
  @Column({ name: 'weekend_walk_in_fee', nullable: true, default: 0 })
  weekendWalkInFee: number;

  @ApiProperty({
    description: 'Fixed fee for booking during evening hours',
    example: 130000,
  })
  @Column({ name: 'evening_fixed_fee', nullable: true, default: 0 })
  eveningFixedFee: number;

  @ApiProperty({
    description: 'Walk-in fee for booking during evening hours',
    example: 200000,
  })
  @Column({ name: 'evening_walk_in_fee', nullable: true, default: 0 })
  eveningWalkInFee: number;

  @ApiProperty({
    description: 'Owner ID of the court',
    example: 'uuid',
  })
  @Column({ name: 'owner_id' })
  ownerId: string;

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

  @OneToMany(() => BookingDetail, bookingDetail => bookingDetail.court)
  bookingDetails: BookingDetail[];

  @OneToMany(() => Product, product => product.court)
  products: Product[];

  @ApiProperty({
    description: 'List of product categories associated with this court',
    type: () => [ProductCategory],
  })
  @OneToMany(() => ProductCategory, productCategory => productCategory.court)
  productCategories: ProductCategory[];

  @BeforeInsert()
  generateSlug() {
    this.slug = slugify(this.name);
  }
}
