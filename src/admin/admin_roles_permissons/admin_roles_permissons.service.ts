import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { AdminRolePermission } from '../entities/admin_role_permission.entity';

@Injectable()
export class AdminRolePermissionService extends TypeOrmCrudService<AdminRolePermission> {
  constructor(@InjectRepository(AdminRolePermission) repo) {
    super(repo);
  }
}
