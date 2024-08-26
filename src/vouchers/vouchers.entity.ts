import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Voucher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column('decimal')
  discount_percentage: number;

  @Column()
  valid_from: Date;

  @Column()
  valid_until: Date;
}
