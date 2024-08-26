import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencyModule, AgencyService } from 'src/agency';
import { SharedModule } from 'src/shared/shared.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminRoleController, AdminRoleService } from './admin_roles';
import { AdminPermissionController, AdminPermissionService } from './admin_permissions';
import { AdminRolePermissionController, AdminRolePermissionService } from './admin_roles_permissons';
import { AdminPermission, AdminProfile, AdminRole, AdminRolePermission } from './entities';
import { Agency } from 'src/agency/entities';
import { EmailService } from 'src/email/email.service';

@Module({
  controllers: [AdminController, AdminRoleController, AdminPermissionController, AdminRolePermissionController],
  providers: [AdminService, JwtService, AdminPermissionService, AdminRoleService, AdminRolePermissionService],
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([AdminPermission, AdminProfile, AdminRolePermission, AdminRole, Agency]),
    ConfigModule,
    AgencyModule,
  ],
  exports: [AdminService, AdminPermissionService, AdminRoleService],
})
export class AdminModule implements OnModuleInit {
  constructor(private readonly adminService: AdminService) { }

  async onModuleInit() {
    const defaultAdmin = await this.adminService.findUserByEmail('pacificwidecrm@gmail.com');

    if (!defaultAdmin) {
      const res = await this.adminService.createAdmin({
        email: 'pacificwidecrm@gmail.com',
        password: 'Admin@123456',
        "firstName": "Pacificwide",
        "lastName": "Admin",
        "mobileNo": "3925888888",
        imagePath: ""
      });
      console.log('Default Admin created', res);
    } else {
      console.log('Default Admin already exists');
    }
  }
}

