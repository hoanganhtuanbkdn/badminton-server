import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Booking } from 'src/bookings/bookings.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('payments')
export class Payment {
  @ApiProperty({
    description: 'Unique identifier for the payment',
    example: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Booking associated with this payment',
    type: () => Booking,
  })
  @ManyToOne(() => Booking, booking => booking.payments)
  booking: Booking;

  @ApiProperty({
    description: 'Method of payment (e.g., Momo, QRcode, Bank Transfer)',
    example: 'Momo',
  })
  @Column()
  paymentMethod: string;

  @ApiProperty({
    description: 'Name of the account holder receiving the payment',
    example: 'John Doe',
  })
  @Column()
  accountHolder: string;

  @ApiProperty({
    description: 'Name of the bank where the account is held',
    example: 'Bank of America',
  })
  @Column()
  bankName: string;

  @ApiProperty({
    description: 'Bank account number',
    example: '1234567890',
  })
  @Column()
  accountNumber: string;

  @ApiProperty({
    description: 'Transaction ID for the payment',
    example: 'TX1234567890',
  })
  @Column()
  transactionId: string;

  @ApiProperty({
    description: 'Amount paid',
    example: 100.5,
  })
  @Column('decimal')
  amount: number;

  @ApiProperty({
    description: 'Date of the payment',
    example: '2024-08-28T14:30:00Z',
  })
  @Column()
  paymentDate: Date;

  @ApiProperty({
    description: 'Status of the payment (e.g., PAID, UNPAID)'
  })
  @Column()
  paymentStatus: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true, default: "" })
  updatedAt: Date;
}
