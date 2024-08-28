import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { Court } from 'src/courts/courts.entity';
import { ApiProperty } from '@nestjs/swagger';
import { slugify } from 'src/shared/utils';

@Entity('owners')
export class Owner {
  @ApiProperty({
    description: 'Unique identifier for the owner',
    example: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Name of the owner',
    example: 'John Doe',
  })
  @Column({ name: 'name' })
  name: string;

  @Column({ nullable: true })
  slug?: string;

  @ApiProperty({
    description: 'Email address of the owner',
    example: 'owner@example.com',
  })
  @Column({ name: 'email' })
  email: string;

  @ApiProperty({
    description: 'Phone number of the owner',
    example: '+1234567890',
  })
  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @ApiProperty({
    description: 'Name of the account holder receiving the payment',
    example: 'John Doe',
  })
  @Column({ nullable: true })
  accountHolder: string;

  @ApiProperty({
    description: 'Name of the bank where the account is held',
    example: 'Bank of America',
  })
  @Column({ nullable: true })
  bankName: string;

  @ApiProperty({
    description: 'Bank account number',
    example: '1234567890',
  })
  @Column()
  accountNumber: string;

  @ApiProperty({
    description: 'List of courts associated with the owner',
    type: () => [Court],
  })
  @OneToMany(() => Court, court => court.owner)
  courts: Court[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true, default: "" })
  updatedAt: Date;

  @BeforeInsert()
  generateSlug() {
    this.slug = slugify(this.name);
  }
}
