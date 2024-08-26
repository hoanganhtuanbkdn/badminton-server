import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Court } from 'src/courts/courts.entity';

@Entity()
export class Owner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @OneToMany(() => Court, court => court.owner)
  courts: Court[];
}
