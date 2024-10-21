import { ApiPropertyOptional } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ACCOUNT_STATUS, REGEX_PASSWORD, requireFieldLength, requireFieldMinLength } from 'src/shared/constants';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { v4 as uuid4 } from 'uuid';
import { AdminRole } from './admin_role.entity';
import { Owner } from 'src/owners/owners.entity';
const { CREATE, UPDATE } = CrudValidationGroups;

@Entity({ name: 'admin' })
export class AdminProfile extends BaseEntity {
  constructor() {
    super();
  }

  @PrimaryColumn({ name: 'admin_id', length: 45, type: 'varchar' })
  id: string;

  @Column({ name: 'first_name', length: 50, type: 'varchar' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(50, { always: true })
  @ApiPropertyOptional({
    description: 'first_name',
    default: 'Pacificwide',
  })
  firstName: string;

  @Column({ name: 'last_name', length: 50, type: 'varchar' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(50, { always: true })
  @ApiPropertyOptional({
    description: 'last_name',
    default: 'Admin',
  })
  lastName: string;

  @Column({ name: 'mobile_no', length: 10, unique: true, type: 'varchar' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @MaxLength(20, { message: requireFieldLength('mobileNo', '10') })
  @ApiPropertyOptional({
    description: 'mobileNo',
    default: '3925888888',
  })
  @IsString()
  mobileNo: string;

  @Column({ unique: true, length: 200, type: 'varchar' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsEmail()
  @MaxLength(200, { message: requireFieldLength('email', '200') })
  @ApiPropertyOptional({
    description: 'email',
    default: 'pacificwidecrm@gmail.com',
  })
  email: string;

  @Column({ name: 'password', length: 256, type: 'varchar' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Matches(REGEX_PASSWORD, { message: 'ERR_MSG_FORMAT_PASSWORD' })
  @MinLength(8, { message: requireFieldMinLength('password', '8') })
  @MaxLength(16, { message: requireFieldLength('password', '16') })
  @IsString()
  // @Exclude()
  @ApiPropertyOptional({
    default: 'Welcome321!',
    description: 'password',
  })
  // @Exclude()
  password: string;

  @Column({ name: 'salt', length: 45, type: 'varchar' })
  @Exclude()
  salt: string;

  @Column({ name: 'image_path', length: 1000, type: 'varchar', nullable: true })
  @IsOptional({ groups: [UPDATE, CREATE] })
  @MaxLength(200)
  @ApiPropertyOptional({
    description: 'image path',
    default: '',
  })
  @IsString()
  imagePath: string;

  @ManyToOne(() => AdminRole, (adminRole) => adminRole.id, {
    eager: true,
    nullable: true,
  })
  @IsOptional({ groups: [UPDATE, CREATE] })
  @MaxLength(200)
  @ApiPropertyOptional({
    description: 'role',
    default: '',
  })
  @IsString()
  role: AdminRole;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ACCOUNT_STATUS,
    default: ACCOUNT_STATUS.ACTIVE,
  })
  @IsOptional({ groups: [CREATE, UPDATE] })
  status: ACCOUNT_STATUS;

  @Column({ name: 'owner_id', nullable: true })
  @ApiPropertyOptional({
    description: 'ID of the associated owner',
  })
  ownerId: string;

  @OneToOne(() => Owner, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner: Owner;

  @CreateDateColumn({ name: 'create_date' })
  createDate: Date;

  @UpdateDateColumn({ name: 'update_date', nullable: true, default: null })
  updateDate: Date;

  @Column({ name: 'active_date', nullable: true, default: null })
  activeDate: Date;

  @BeforeInsert()
  generateId() {
    const uuid = uuid4();
    this.id = uuid;
  }

  @BeforeInsert()
  async hashPassword() {
    //Salt Encryption
    const salt = await bcrypt.genSalt(10);
    // console.log('salt', salt);
    // console.log('this.password', this.password);


    const hashedPasswordBcrypt = await bcrypt.hash(this.password, salt);
    const test = await bcrypt.compare(this.password, hashedPasswordBcrypt);
    //Stored Salt + 256 encryption
    this.password = hashedPasswordBcrypt;
    this.salt = salt;
  }

  @BeforeInsert()
  async lowerCase() {
    if (this.email) {
      this.email = this.email.toLocaleLowerCase();
    }
  }
}
