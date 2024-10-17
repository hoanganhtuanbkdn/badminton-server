import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { BookingDetail } from '../booking-details/booking-details.entity';
import { OrderItem } from '../order-items/order-items.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum OrderStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID'
}

export enum PaymentMethod {
  CASH = 'CASH',
  TRANSFER = 'TRANSFER'
}

@Entity('orders')
export class Order {
  @ApiProperty({ description: 'The unique identifier for the order' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The order code' })
  @Column({ unique: true })
  orderCode: string;

  @ApiProperty({ description: 'The ID of the booking detail associated with this order', required: false, nullable: true })
  @Column({ name: 'booking_detail_id', nullable: true })
  bookingDetailId: string | null;

  @ApiProperty({ description: 'The booking detail associated with this order', type: () => BookingDetail, required: false })
  @ManyToOne(() => BookingDetail, bookingDetail => bookingDetail.orders, { nullable: true })
  @JoinColumn({ name: 'booking_detail_id' })
  bookingDetail: BookingDetail | null;

  @ApiProperty({ description: 'The items in this order', type: () => [OrderItem] })
  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  orderItems: OrderItem[];

  @ApiProperty({ description: 'Payment status of the order', enum: ['PAID', 'UNPAID'], example: 'UNPAID' })
  @Column({
    type: 'enum',
    enum: ['PAID', 'UNPAID'],
    default: 'UNPAID',
    nullable: true
  })
  status: string;

  @ApiProperty({ description: 'Payment method for the order', enum: ['TRANSFER', 'CASH'], nullable: true, example: 'TRANSFER' })
  @Column({
    type: 'enum',
    enum: ['TRANSFER', 'CASH'],
    nullable: true
  })
  paymentMethod: string;

  @ApiProperty({ description: 'The total amount of the order' })
  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @ApiProperty({ description: 'The date and time when the order was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date and time when the order was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
