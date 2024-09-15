import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, BeforeInsert, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Court } from 'src/courts/courts.entity';
import { BookingDetail } from 'src/booking-details/booking-details.entity';
import { ApiProperty } from '@nestjs/swagger';
import { slugify } from 'src/shared/utils';

@Entity('positions')
export class Position {
  @ApiProperty({
    description: 'Unique identifier for the position',
    example: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Name of the position',
    example: 'Position 1',
  })
  @Column({ name: 'name' })
  name: string;

  @Column({ nullable: true })
  slug?: string;

  @ApiProperty({
    description: 'Description of the position (nullable)',
    example: 'This is a corner position.',
    required: false,
  })
  @Column({ name: 'description', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Court ID associated with this position',
    example: 'uuid',
  })
  @Column({ name: 'court_id' })
  courtId: string;

  @ApiProperty({
    description: 'Court associated with this position',
    type: () => Court,
  })
  @ManyToOne(() => Court, court => court.positions, { nullable: false })
  @JoinColumn({ name: 'court_id' })
  court: Court;

  @OneToMany(() => BookingDetail, bookingDetail => bookingDetail.position)
  bookingDetails: BookingDetail[];

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
    description: 'Fixed fee for booking during this time slot',
    example: 100000,
  })
  @Column({ name: 'fixed_fee', nullable: true, default: 0 })
  fixedFee: number;

  @ApiProperty({
    description: 'Walk-in fee for booking during this time slot',
    example: 150000,
  })
  @Column({ name: 'walk_in_fee', nullable: true, default: 0 })
  walkInFee: number;

  @CreateDateColumn({ name: 'created_at', nullable: true, default: "" })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true, default: "" })
  updatedAt: Date;

  @BeforeInsert()
  generateSlug() {
    this.slug = slugify(this.name);
  }
}
