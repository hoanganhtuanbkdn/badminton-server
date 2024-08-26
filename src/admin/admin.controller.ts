import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { AgencyService } from 'src/agency/agency.service';
import { ROLE } from 'src/auth/constants/role.constant';
import { Roles } from 'src/auth/decorators/role.decorator';
import { TAuthenticationJWT } from 'src/shared/constants';
import { Public } from 'src/shared/decorators/public.decorator';
import { ReqContext } from 'src/shared/request-context/req-context.decorator';
import { RequestContext } from 'src/shared/request-context/request-context.dto';
import { AdminUserDto } from './dtos/admin-user.dto';
import { AuthLoginAdminDto } from './dtos/auth-login-admin.dto';
import { EmailInput } from './dtos/email.dto';
import { OTPEmailDTO } from './dtos/otp_email.dto';
import { ResetPasswordDTO } from './dtos/reset_password.dto';
import { JwtAuthGuard, RolesGuard, JwtRefreshGuard } from 'src/auth';
import { REDIS_KEY_SIGNIN } from './constants';
import { AdminProfile } from './entities';
import { AdminService } from './admin.service';
import { AdminRoleService } from './admin_roles';

@Crud({
  model: {
    type: AdminProfile,
  },
  // validation: false,
  dto: {
    create: AdminUserDto,
    update: AdminProfile,
    replace: AdminProfile,
  },
  routes: {
    only: ['deleteOneBase', 'getOneBase', 'updateOneBase', 'createOneBase', 'getManyBase'],
  },
  query: {
    exclude: ['password']
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
})
@ApiTags('admin')
@Controller('admin')
export class AdminController implements CrudController<AdminProfile> {
  constructor(
    public service: AdminService,
    public agencyService: AgencyService,
    public adminRoleService: AdminRoleService,
  ) { }

  get base(): CrudController<AdminProfile> {
    return this;
  }

  @ApiOperation({
    summary: 'API for user refresh-token',
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @Get('refresh-token')
  async refreshToken(@ReqContext() ctx: RequestContext) {
    console.log('ctx.user', ctx.user);

    if (ctx?.user && ctx?.user?.roles.includes(ROLE.SUPER_ADMIN)) {
      const admin = await this.service.getAdminByToken(ctx.user.id);
      const authToken = await this.service.generateTokenAdmin({
        id: admin.id,
        email: admin.email,
        roles: [ROLE.SUPER_ADMIN],
      });
      return {
        data: {
          email: admin.email,
          roles: [ROLE.SUPER_ADMIN],
          ...authToken,
        },
      };
    } else {
      const agency = await this.agencyService.findById(ctx.user.id);
      const authToken = await this.service.generateTokenAdmin({
        id: agency.id,
        email: agency.email,
        roles: [ROLE.AGENT],
      });
      return {
        data: {
          email: agency.email,
          roles: [ROLE.AGENT],
          ...authToken,
        },
      };
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'This endpoint is used for admin to login to panel.',
  })
  @Public()
  @Post('login')
  async loginEmail(@Body() data: AuthLoginAdminDto) {
    return this.service.loginAdmin(data);
  }

  @Post('login/otp/email/resend')
  @ApiOperation({
    summary: 'API for user otp/email/resend',
  })
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  loginOtpEmailResendPost(@Body() payload: EmailInput): Promise<{
    data: TAuthenticationJWT
  }> {
    return this.service.loginResentOTP(payload.email);
  }

  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({
  //   summary: 'This endpoint is used for admin to logout to panel.',
  // })
  // @Public()
  // @Post('logout')
  // async logoutEmail() {

  //   return true;
  // }

  @ApiOperation({
    summary: 'API check current admin',
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.SUPER_ADMIN)
  @Get('me')
  async currentUser(@ReqContext() ctx: RequestContext): Promise<any> {
    if (ctx?.user && ctx?.user?.roles.includes(ROLE.SUPER_ADMIN)) {
      const admin = await this.service.getAdminByToken(ctx.user.id);

      return admin;
    } else {
      const agency = await this.agencyService.findById(ctx.user.id);

      return agency;
    }
  }

  @ApiOperation({
    summary: 'API for user otp/email',
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @Public()
  @Post('forgot-password/otp/email')
  async forgotOtpEmailPost(@Body() payload: EmailInput): Promise<boolean> {
    return this.service.forgotOtpEmail(payload.email);
  }

  @ApiOperation({
    summary: 'API for user reset-password',
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @Public()
  @Post('reset-password')
  resetPassword(@Body() payload: ResetPasswordDTO): Promise<boolean> {
    return this.service.postResetPassword(payload);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'API for user login/otp/email/validation',
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @Public()
  @Post('login/otp/email/validation')
  async otpEmailVerify(@Body() param: OTPEmailDTO): Promise<{
    data: TAuthenticationJWT
  }> {
    // check OTP by email and key
    const isVerified = await this.service.OTPEmailValidate(param, REDIS_KEY_SIGNIN);
    if (!isVerified) {
      throw new BadRequestException(`OTP code invalid`);
    }

    const { email } = param;
    const admin = await this.service.findOne({
      where: { email },
      relations: {
        role: true,
      },
    });
    if (!admin) {
      throw new BadRequestException(`Data not found`);
    }
    await this.service.deleteRedisByKey(email, REDIS_KEY_SIGNIN);

    const { id, mobileNo, firstName, lastName, imagePath, createDate, updateDate } = admin;

    const authToken = await this.service.generateTokenAdmin({
      id,
      email,
      roles: [ROLE.SUPER_ADMIN],
    });

    //save accessToken, refreshToken to redis

    const dataPermission = await this.service.getPermission(ROLE.SUPER_ADMIN);

    return {
      data: {
        email,
        verifyType: 'email',
        roles: [ROLE.SUPER_ADMIN],
        ...authToken,
        user: {
          id,
          userName: '',
          primaryPhone: mobileNo,
          firstName,
          lastName,
          roles: [ROLE.SUPER_ADMIN],
          email,
          createdAt: createDate.toString(),
          updatedAt: updateDate.toString(),
          imagePath
        },
        rolePermission: dataPermission
      },
    };

  }

  @Post('forgot-password/otp/email/resend')
  @ApiOperation({
    summary: 'API for user otp/email/resend',
  })
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  forgotOtpEmailResendPost(@Body() payload: EmailInput): Promise<boolean> {
    return this.service.forgotOtpEmail(payload.email);
  }

  @Override('getManyBase')
  @Public()
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @Override('getOneBase')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.SUPER_ADMIN)
  @ApiBearerAuth()
  getOne(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @Override('createOneBase')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.SUPER_ADMIN)
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: AdminProfile) {
    return this.base.createOneBase(req, dto);
  }

  @Override('updateOneBase')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.SUPER_ADMIN)
  updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: AdminProfile) {
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
