import { ApiPropertyOptional } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import {
  BaseEntity,
  BeforeInsert,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuid4 } from 'uuid';
import { AdminRole } from './admin_role.entity';
import { AdminPermission } from './admin_permission.entity';
const { CREATE, UPDATE } = CrudValidationGroups;

@Entity({ name: 'admin_role_permission' })
export class AdminRolePermission extends BaseEntity {
  @PrimaryColumn({ name: 'role_permission_id', length: 45, type: 'varchar' })
  id: string;

  @ManyToOne(() => AdminRole)
  @JoinColumn({ name: 'role_id' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(50, { always: true })
  @ApiPropertyOptional({
    description: 'role',
    default: 'role id',
  })
  role: AdminRole;

  @Index('idx_permission')
  @ManyToOne(() => AdminPermission)
  @JoinColumn({ name: 'permission_id' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(50, { always: true })
  @ApiPropertyOptional({
    description: 'permission',
    default: 'permission id',
  })
  permission: AdminPermission;

  @CreateDateColumn({ name: 'create_date' })
  createDate: Date;

  @BeforeInsert()
  generateId() {
    const uuid = uuid4();
    this.id = uuid;
  }
}
