import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Court } from 'src/courts/courts.entity';
import { ApiProperty } from '@nestjs/swagger';

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
    description: 'List of courts associated with the owner',
    type: () => [Court],
  })
  @OneToMany(() => Court, court => court.owner)
  courts: Court[];
}
