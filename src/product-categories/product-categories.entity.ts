import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from '../products/products.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('product_categories')
export class ProductCategory {
  @ApiProperty({ description: 'The unique identifier for the product category' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The name of the product category' })
  @Column()
  name: string;

  @ApiProperty({ description: 'The description of the product category', required: false })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'The products associated with this category', type: () => [Product] })
  @OneToMany(() => Product, product => product.category)
  products: Product[];

  @ApiProperty({ description: 'Creation date of the product category' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date of the product category' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
