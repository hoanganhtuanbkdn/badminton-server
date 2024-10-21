import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { Court } from 'src/courts/courts.entity';
import { ApiProperty } from '@nestjs/swagger';
import { slugify } from 'src/shared/utils';
import { BookingDetail } from 'src/booking-details/booking-details.entity';

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
  @Column({ name: 'email', nullable: true })
  email: string;

  @ApiProperty({
    description: 'Phone number of the owner',
    example: '+1234567890',
  })
  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @ApiProperty({
    description: 'Tên tài khoản ngân hàng. Nhập tiếng Việt không dấu, viết hoa, tối thiểu 5 ký tự, tối đa 50 kí tự, không chứa các ký tự đặc biệt.',
    example: 'John Doe',
  })
  @Column({ nullable: true })
  accountName: string;

  @ApiProperty({
    description: 'Name of the bank where the account is held',
    example: 'Bank of America',
  })
  @Column({ nullable: true })
  bankName: string;

  @ApiProperty({
    description: 'Số tài khoản ngân hàng thụ hưởng. Chỉ nhập số, tối thiểu 6 ký tự, tối đa 19 kí tự',
    example: '1234567890',
  })
  @Column({ nullable: true })
  accountNo: string;

  @ApiProperty({
    description: 'Mã định danh ngân hàng (thường gọi là BIN) 6 chữ số, quy đinh bởi ngân hàng nước',
    example: '1234567890',
  })
  @Column({ nullable: true })
  acqId: string;

  @ApiProperty({
    description: 'List of courts associated with the owner',
    type: () => [Court],
  })
  @OneToMany(() => Court, court => court.owner)
  courts: Court[];

  @OneToMany(() => BookingDetail, bookingDetail => bookingDetail.owner)
  bookingDetails: BookingDetail[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true, default: "" })
  updatedAt: Date;

  @BeforeInsert()
  generateSlug() {
    this.slug = slugify(this.name);
  }
}
