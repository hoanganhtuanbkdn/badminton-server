import { ApiPropertyOptional } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Status } from 'src/shared/constants';
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { v4 as uuid4 } from 'uuid';
const { CREATE, UPDATE } = CrudValidationGroups;

@Entity({ name: 'admin_role' })
export class AdminRole extends BaseEntity {
  @PrimaryColumn({ name: 'role_id', length: 45, type: 'varchar' })
  id: string;

  @Column({ name: 'role_name', length: 100, type: 'varchar' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(50, { always: true })
  @ApiPropertyOptional({
    description: 'roleName',
    default: 'AGENT',
  })
  roleName: string;

  @Column({ name: 'is_superadmin', type: 'boolean', default: false })
  @IsOptional({ groups: [UPDATE, CREATE] })
  @IsBoolean({ always: true })
  @ApiPropertyOptional({
    description: 'isSuperAdmin',
    default: false,
  })
  isSuperAdmin: boolean;

  @Column({
    name: 'status',
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @CreateDateColumn({ name: 'create_date' })
  createDate: Date;

  @UpdateDateColumn({ name: 'update_date', nullable: true, default: null })
  updateDate: Date;

  @BeforeInsert()
  generateId() {
    const uuid = uuid4();
    this.id = uuid;
  }
}
