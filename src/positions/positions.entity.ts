import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Court } from 'src/courts/courts.entity';
import { BookingDetail } from 'src/booking-details/booking-details.entity';
import { ApiProperty } from '@nestjs/swagger';

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
    example: 'Position A',
  })
  @Column({ name: 'name' })
  name: string;

  @ApiProperty({
    description: 'Description of the position',
    example: 'This is a description for Position A',
    required: false,
  })
  @Column({ name: 'description', nullable: true })
  description: string;

  @ApiProperty({
    description: 'Court associated with this position',
    type: () => Court,
  })
  @ManyToOne(() => Court, court => court.positions)
  court: Court;

  @ApiProperty({
    description: 'List of booking details associated with this position',
    type: () => [BookingDetail],
  })
  @OneToMany(() => BookingDetail, bookingDetail => bookingDetail.position)
  bookingDetails: BookingDetail[];
}
