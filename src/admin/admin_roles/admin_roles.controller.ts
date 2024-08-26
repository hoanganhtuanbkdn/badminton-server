import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { ROLE } from 'src/auth/constants/role.constant';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminRole } from '../entities/admin_role.entity';
import { AdminRoleService } from './admin_roles.service';
// import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth';

@Crud({
  model: {
    type: AdminRole,
  },
  dto: {
    create: AdminRole,
    update: AdminRole,
    replace: AdminRole,
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
@ApiTags('admin-role')
@Controller('admin-role')
export class AdminRoleController implements CrudController<AdminRole> {
  constructor(public service: AdminRoleService) { }

  get base(): CrudController<AdminRole> {
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
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(ROLE.SUPER_ADMIN)
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: AdminRole) {
    return this.base.createOneBase(req, dto);
  }

  @Override('updateOneBase')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.SUPER_ADMIN)
  updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: AdminRole) {
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
