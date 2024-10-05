import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { BookingDetail } from '../booking-details/booking-details.entity';
import { OrderItem } from '../order-items/order-items.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer'
}

@Entity('orders')
export class Order {
  @ApiProperty({ description: 'The unique identifier for the order' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The ID of the booking detail associated with this order' })
  @Column({ name: 'booking_detail_id' })
  bookingDetailId: string;

  @ApiProperty({ description: 'The booking detail associated with this order', type: () => BookingDetail })
  @ManyToOne(() => BookingDetail, bookingDetail => bookingDetail.orders)
  @JoinColumn({ name: 'booking_detail_id' })
  bookingDetail: BookingDetail;

  @ApiProperty({ description: 'The items in this order', type: () => [OrderItem] })
  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  orderItems: OrderItem[];

  @ApiProperty({ description: 'The status of the order', enum: OrderStatus })
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  status: OrderStatus;

  @ApiProperty({ description: 'The payment method for the order', enum: PaymentMethod })
  @Column({
    type: 'enum',
    enum: PaymentMethod
  })
  paymentMethod: PaymentMethod;

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
