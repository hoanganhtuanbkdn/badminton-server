import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Booking } from 'src/bookings/bookings.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Court } from 'src/courts/courts.entity';

@Entity('customers')
export class Customer {
  @ApiProperty({
    description: 'Unique identifier for the customer',
    example: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Name of the customer',
    example: 'John Doe',
  })
  @Column({ name: 'name', nullable: true })
  name: string;

  @ApiProperty({
    description: 'Phone number of the customer',
    example: '+1234567890',
  })
  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @ApiProperty({
    description: 'Email address of the customer',
    example: 'johndoe@example.com',
  })
  @Column({ name: 'email', nullable: true })
  email: string;

  @ApiProperty({
    description: 'Additional notes about the customer',
    example: 'VIP customer',
    required: false,
  })
  @Column({ name: 'notes', nullable: true })
  notes: string;

  @ApiProperty({
    description: 'Bookings associated with this customer',
    type: () => [Booking],
  })
  @OneToMany(() => Booking, booking => booking.customer)
  bookings: Booking[];

  @CreateDateColumn({ name: 'created_at', nullable: true, })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true, default: "" })
  updatedAt: Date;
}

