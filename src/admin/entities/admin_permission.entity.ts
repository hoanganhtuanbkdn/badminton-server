import { ApiPropertyOptional } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { v4 as uuid4 } from 'uuid';
const { CREATE, UPDATE } = CrudValidationGroups;

@Entity({ name: 'admin_permission' })
export class AdminPermission extends BaseEntity {
  @PrimaryColumn({ name: 'permission_id', length: 45, type: 'varchar' })
  id: string;

  @Column({ name: 'permission_name', length: 100, type: 'varchar' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(50, { always: true })
  @ApiPropertyOptional({
    description: 'permissionName',
    default: 'Vu',
  })
  permissionName: string;

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
