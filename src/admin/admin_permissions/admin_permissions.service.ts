import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { AdminPermission } from "../entities";

@Injectable()
export class AdminPermissionService extends TypeOrmCrudService<AdminPermission> {
  constructor(@InjectRepository(AdminPermission) repo) {
    super(repo);
  }
}
