import { Controller, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { Crud, CrudController, Override, ParsedRequest, CrudRequest, ParsedBody } from "@nestjsx/crud";
import { JwtAuthGuard, RolesGuard, Roles } from "src/auth";
import { ROLE } from "src/auth/constants/role.constant";
import { AdminPermission } from "../entities";
import { AdminPermissionService } from "./admin_permissions.service";


@Crud({
  model: {
    type: AdminPermission,
  },
  dto: {
    create: AdminPermission,
    update: AdminPermission,
    replace: AdminPermission,
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
@ApiTags('admin-permission')
@Controller('admin-permission')
export class AdminPermissionController implements CrudController<AdminPermission> {
  constructor(public service: AdminPermissionService) { }
  get base(): CrudController<AdminPermission> {
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
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: AdminPermission) {
    return this.base.createOneBase(req, dto);
  }

  @Override('updateOneBase')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.SUPER_ADMIN)
  updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: AdminPermission) {
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
