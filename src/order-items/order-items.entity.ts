import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from '../orders/orders.entity';
import { Product } from '../products/products.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('order_items')
export class OrderItem {
  @ApiProperty({ description: 'Unique identifier for the order item', example: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'ID of the associated order', example: 'uuid' })
  @Column({ name: 'order_id' })
  orderId: string;

  @ApiProperty({ description: 'Associated order', type: () => Order })
  @ManyToOne(() => Order, order => order.orderItems)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ApiProperty({ description: 'ID of the associated product', example: 'uuid' })
  @Column({ name: 'product_id' })
  productId: string;

  @ApiProperty({ description: 'Associated product', type: () => Product })
  @ManyToOne(() => Product, product => product.orderItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ApiProperty({ description: 'Quantity of the product ordered', example: 2 })
  @Column()
  quantity: number;

  @ApiProperty({ description: 'Price of the order item', example: 19.99 })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: 'Payment status of the order item', enum: ['PAID', 'UNPAID'], example: 'UNPAID' })
  @Column({
    type: 'enum',
    enum: ['PAID', 'UNPAID'],
    default: 'UNPAID',
    nullable: true
  })
  status: string;

  @ApiProperty({ description: 'Payment method for the order item', enum: ['TRANSFER', 'CASH'], nullable: true, example: 'TRANSFER' })
  @Column({
    type: 'enum',
    enum: ['TRANSFER', 'CASH'],
    nullable: true
  })
  paymentMethod: string;

  @ApiProperty({ description: 'Additional notes for the order item', nullable: true, example: 'Special instructions' })
  @Column({ nullable: true })
  notes: string;

  @ApiProperty({ description: 'Created at', example: '2024-01-01T00:00:00Z' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', example: '2024-01-01T00:00:00Z' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
