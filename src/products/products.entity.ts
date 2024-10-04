import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { ProductCategory } from '../product-categories/product-categories.entity';
import { OrderItem } from '../order-items/order-items.entity';
import { Court } from '../courts/courts.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('products')
export class Product {
  @ApiProperty({ description: 'The unique identifier for the product' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The name of the product' })
  @Column()
  name: string;

  @ApiProperty({ description: 'The price of the product', type: 'number' })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiPropertyOptional({ description: 'The description of the product' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'The quantity of the product in stock', default: 0 })
  @Column({ name: 'stock_quantity', default: 0 })
  stockQuantity: number;

  @ApiPropertyOptional({ description: 'URL or path to the product image' })
  @Column({ nullable: true })
  image: string;

  @ApiPropertyOptional({ description: 'The ID of the product category' })
  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @ApiProperty({ description: 'The category of the product', type: () => ProductCategory })
  @ManyToOne(() => ProductCategory, category => category.products)
  @JoinColumn({ name: 'category_id' })
  category: ProductCategory;

  @ApiProperty({ description: 'The court associated with the product', type: () => Court })
  @ManyToOne(() => Court, court => court.products)
  court: Court;

  @ApiProperty({ description: 'The order items associated with this product', type: () => [OrderItem] })
  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  @ApiProperty({ description: 'Creation date of the product' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date of the product' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
