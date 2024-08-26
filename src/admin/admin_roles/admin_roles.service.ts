import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { AdminRole } from '../entities/admin_role.entity';
import { uniq } from 'lodash';

@Injectable()
export class AdminRoleService extends TypeOrmCrudService<AdminRole> {
  constructor(@InjectRepository(AdminRole) repo) {
    super(repo);
  }
  getSelect(query, options) {
    return uniq(super.getSelect(query, options));
  }
}
