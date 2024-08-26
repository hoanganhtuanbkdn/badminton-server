import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { ROLE } from 'src/auth/constants/role.constant';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard, RolesGuard } from 'src/auth';
import { AdminRolePermission } from '../entities/admin_role_permission.entity';
import { AdminRolePermissionService } from './admin_roles_permissons.service';

@Crud({
  model: {
    type: AdminRolePermission,
  },
  // validation: false,
  query: {
    alwaysPaginate: true,
    join: {
      permission: {
        eager: true,
        exclude: ['password'],
      },
      role: {
        eager: true,
        exclude: ['password'],
      },
    },
    exclude: ['password'],
  },
  dto: {
    create: AdminRolePermission,
    update: AdminRolePermission,
    replace: AdminRolePermission,
  },
  routes: {
    only: ['deleteOneBase', 'getOneBase', 'updateOneBase', 'createOneBase', 'getManyBase'],
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
})
@ApiTags('admin-role-permission')
@Controller('admin-role-permission')
export class AdminRolePermissionController implements CrudController<AdminRolePermission> {
  constructor(public service: AdminRolePermissionService) { }

  get base(): CrudController<AdminRolePermission> {
    return this;
  }

  @Override('getManyBase')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)

  @Roles(ROLE.SUPER_ADMIN)
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @Override('getOneBase')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)

  @Roles(ROLE.SUPER_ADMIN)
  getOne(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @Override('createOneBase')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)

  @Roles(ROLE.SUPER_ADMIN)
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: AdminRolePermission) {
    return this.base.createOneBase(req, dto);
  }

  @Override('updateOneBase')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)

  @Roles(ROLE.SUPER_ADMIN)
  updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: AdminRolePermission) {
    return this.base.updateOneBase(req, dto);
  }

  @Override('deleteOneBase')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)

  @Roles(ROLE.SUPER_ADMIN)
  async deleteOne(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }
}
