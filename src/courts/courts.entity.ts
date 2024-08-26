import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Owner } from 'src/owners/owners.entity';
import { Position } from 'src/positions/positions.entity';
import { TimeSlot } from 'src/timeslots/timeslots.entity';
import { Booking } from 'src/bookings/bookings.entity';

@Entity('courts')
export class Court {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  coordinate: string;

  @Column()
  phone_number: string;

  @Column()
  banner: string;

  @ManyToOne(() => Owner, owner => owner.courts)
  owner: Owner;

  @OneToMany(() => Position, position => position.court)
  positions: Position[];

  @OneToMany(() => TimeSlot, timeSlot => timeSlot.court)
  timeSlots: TimeSlot[];

  @OneToMany(() => Booking, booking => booking.court)
  bookings: Booking[];
}
