import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Voucher {
  @ApiProperty({
    description: 'Unique identifier for the voucher',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Code of the voucher',
    example: 'SUMMER2024',
  })
  @Column({ name: 'code' })
  code: string;

  @ApiProperty({
    description: 'Percentage discount applied by the voucher',
    example: 15.0,
  })
  @Column('decimal', { name: 'discount_percentage', default: 0, nullable: true })
  discountPercentage: number;

  @ApiProperty({
    description: 'Fixed discount value applied by the voucher',
    example: 50000,
  })
  @Column('decimal', { name: 'discount_value', default: 0, nullable: true })
  discountValue: number;

  @ApiProperty({
    description: 'Start date from which the voucher is valid',
    example: '2024-09-01T00:00:00.000Z',
  })
  @Column({ name: 'valid_from', nullable: true })
  validFrom: Date;

  @ApiProperty({
    description: 'End date until which the voucher is valid',
    example: '2024-12-31T23:59:59.000Z',
  })
  @Column({ name: 'valid_until', nullable: true })
  validUntil: Date;

  @ApiProperty({
    description: 'Maximum number of times the voucher can be used',
    example: 100,
  })
  @Column({ name: 'max_usage', type: 'int', nullable: true })
  maxUsage: number;

  @ApiProperty({
    description: 'Number of times the voucher is still available for use',
    example: 50,
  })
  @Column({ name: 'available_usage', type: 'int', nullable: true })
  availableUsage: number;
}
