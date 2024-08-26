import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import * as bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { Redis } from 'ioredis';
import { uniq } from 'lodash';
import { ROLE } from 'src/auth/constants/role.constant';
import { AuthTokenOutput, UserAccessTokenClaims } from 'src/auth/dtos/auth-token-output.dto';
import { BaseError } from 'src/shared/base-error';
import { ACCOUNT_STATUS, AGENCY_STATUS, RolePermission, TAuthenticationJWT, generateRandomStringKey } from 'src/shared/constants';
import { CommonService } from 'src/shared/services/common/common.service';
import { MailService } from 'src/shared/services/mail/mail.service';
import { Repository } from 'typeorm';

import { REDIS_KEY_FORGOT, REDIS_KEY_SIGNIN } from './constants';
import { AdminProfile, AdminRole, AdminRolePermission } from './entities';
import { AgencyService } from 'src/agency';
import { AuthLoginAdminDto, OTPEmailDTO, ResetPasswordDTO } from './dtos';
import { Agency } from 'src/agency/entities';

@Injectable()
export class AdminService extends TypeOrmCrudService<AdminProfile> {
  constructor(
    @InjectRepository(AdminRole)
    private readonly adminRoleRepository: Repository<AdminRole>,
    @InjectRepository(AdminRolePermission)
    private readonly adminRolePermissionRepository: Repository<AdminRolePermission>,
    @InjectRepository(AdminProfile)
    private readonly adminProfileRepository: Repository<AdminProfile>,
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
    private jwtService: JwtService,
    private agencyService: AgencyService,
    private commonService: CommonService,
    @InjectRedis() private readonly redis: Redis,
    private mailService: MailService,

  ) {
    super(adminProfileRepository);
  }

  async createAdmin(adminData: Partial<AdminProfile>): Promise<AdminProfile> {
    const admin = this.adminProfileRepository.create(adminData);
    return this.adminProfileRepository.save(admin);
  }

  async findUserByEmail(email: string): Promise<AdminProfile | undefined> {
    return this.adminProfileRepository.findOne({ where: { email } });
  }

  getSelect(query, options) {
    return uniq(super.getSelect(query, options));
  }

  async loginAdmin(data: AuthLoginAdminDto): Promise<{
    data: TAuthenticationJWT
  }> {
    const { email, password } = data;
    // check admin table
    const admin = await this.adminProfileRepository.findOne({
      where: { email },
      relations: {
        role: true,
      },
    });

    if (admin) {

      if (admin.status === ACCOUNT_STATUS.INACTIVE) {
        throw BaseError.ACCOUNT_INACTIVE_UNABLE_TO_PROCEED();
      }

      await this.validateEmailPassword(admin, password, ROLE.SUPER_ADMIN);

      // send OTP code to superadmin email
      this.commonService.sendOtpToEmail(email, admin.firstName, admin.lastName, REDIS_KEY_SIGNIN);

      return {
        data: {
          email,
          verifyType: 'email',
          roles: [ROLE.SUPER_ADMIN],
        },
      };

    }

    const agency = await this.agencyService.findOne({
      where: { email },
    });

    console.log('agency', agency);

    if (agency) {
      if (agency.status === AGENCY_STATUS.INACTIVE) {
        // throw BaseError.ACCOUNT_INACTIVE_UNABLE_TO_PROCEED();
        throw new HttpException(
          {
            inactiveAccount: true,
            message: 'Your account is inactive',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // ctx: RequestContext, userData: { password: string, email: string, firstName: string, lastName: string }, password: string

      await this.validateEmailPassword(agency, password, ROLE.AGENT);

      if (!agency.resetPasswordDefaut) {
        const key32digits = generateRandomStringKey();
        const key_forgot = `user:${REDIS_KEY_FORGOT}:${key32digits}`;

        await this.redis.setex(key_forgot, parseInt(process.env.TIME_EXPIRED_OTP_EMAIL_FORGOT), email);
        return {
          data: {
            email,
            verifyType: 'email',
            roles: [ROLE.AGENT],
            user: {
              id: agency.id,
              userName: agency.userName,
              primaryPhone: agency.phone,
              firstName: agency.firstName,
              lastName: agency.lastName,
              roles: [ROLE.AGENT],
              email: agency.email,
              createdAt: agency.createdAt.toString(),
              updatedAt: agency.updatedAt.toString(),
              imagePath: agency.imagePath,
              resetPasswordDefaut: agency.resetPasswordDefaut,
              keyResetPasswordDefaut: key32digits
            },
          },
        };
      } else {
        const dataPermission = await this.getPermission(ROLE.AGENT);

        const authToken = await this.generateTokenAdmin({
          id: agency.id,
          email: agency.email,
          roles: [ROLE.AGENT],
        });

        return {
          data: {
            email,
            verifyType: 'email',
            roles: [ROLE.AGENT],
            ...authToken,
            user: {
              id: agency.id,
              userName: agency.userName,
              primaryPhone: agency.phone,
              firstName: agency.firstName,
              lastName: agency.lastName,
              roles: [ROLE.AGENT],
              email: agency.email,
              createdAt: agency.createdAt.toString(),
              updatedAt: agency.updatedAt.toString(),
              imagePath: agency.imagePath,
              resetPasswordDefaut: agency.resetPasswordDefaut,

            },
            rolePermission: dataPermission
          },
        };

      }
    }

    if (!admin && !agency) {
      throw BaseError.EMAIL_NOT_EXIST();
    }
  }
  async loginResentOTP(email: string): Promise<{
    data: TAuthenticationJWT
  }> {
    // check admin table
    const admin = await this.adminProfileRepository.findOne({
      where: { email },
      relations: {
        role: true,
      },
    });

    if (!admin) {
      throw BaseError.EMAIL_NOT_EXIST();
    }
    if (admin) {

      if (admin.status === ACCOUNT_STATUS.INACTIVE) {
        throw BaseError.ACCOUNT_INACTIVE_UNABLE_TO_PROCEED();
      }

      // send OTP code to superadmin email
      this.commonService.sendOtpToEmail(email, admin.firstName, admin.lastName, REDIS_KEY_SIGNIN);

      return {
        data: {
          email,
          verifyType: 'email',
          roles: [ROLE.SUPER_ADMIN],
        },
      };
    }
  }

  async getPermission(role: string): Promise<{
    agency: RolePermission;
    teamAgency: RolePermission;
  }> {
    console.log('role', role);
    const dataRole = await this.adminRoleRepository.findOne({ where: { roleName: role } });
    const dataRolePermission = await this.adminRolePermissionRepository.find({ where: { role: { id: dataRole.id } }, relations: ['role', 'permission'] });
    const dataPermission = {
      agency: {},
      teamAgency: {}
    };
    dataRolePermission.forEach(ele => {
      const [module, action] = ele.permission.permissionName.split(":");
      console.log('module', module);
      console.log('action', action);
      dataPermission[module][action] = true;

    });
    return dataPermission;
  }


  async forgotOtpEmail(email: string): Promise<boolean> {
    const admin = await this.adminProfileRepository.findOne({
      where: { email, status: ACCOUNT_STATUS.ACTIVE },
      relations: {
        role: true,
      },
    });
    const agency = await this.agencyService.findOne({
      where: { email, status: AGENCY_STATUS.ACTIVE },
    });

    if (!admin && !agency) {
      throw BaseError.EMAIL_NOT_EXIST();
    } else if (admin) {
      try {
        const test = await this.commonService.sendOtpToEmail(email, admin.firstName, admin.lastName, REDIS_KEY_FORGOT);
        console.log('test', test);
        return true;
      } catch (error) {
        throw new BadRequestException(error);
      }
    } else if (agency) {
      try {
        const test = await this.commonService.sendOtpToEmail(email, agency.firstName, agency.lastName, REDIS_KEY_FORGOT);
        console.log('test', test);

        return true;
      } catch (error) {
        throw new BadRequestException(error);
      }
    } else {
      throw BaseError.EMAIL_NOT_EXIST();

    }
  }

  async postResetPassword(payload: ResetPasswordDTO): Promise<boolean> {
    // check match password
    const { resetKey, newPassword } = payload;

    try {
      // const keyRedis = `user:${resetKey}:resetKey`;

      // case REDIS_KEY_FORGOT:

      // // this.checkTimeDuringBetweenRequest(key_forgot, parseInt(process.env.TIME_DURING_BETWEEN_REQUEST_OTP));
      // const key32digits = generateRandomStringKey();
      const keyRedis = `user:${REDIS_KEY_FORGOT}:${resetKey}`;

      const email = await this.redis.get(`${keyRedis}`);
      console.log(email, 'email');
      if (email) {
        const admin = await this.adminProfileRepository.findOne({
          where: { email: email, status: ACCOUNT_STATUS.ACTIVE },
          relations: {
            role: true,
          },
        });
        const agency = await this.agencyService.findOne({
          where: { email: email, status: AGENCY_STATUS.ACTIVE },
        });
        if (!admin && !agency) {
          throw BaseError.EMAIL_NOT_EXIST();
        } else if (admin) {
          const salt = await bcrypt.genSalt(10);
          const hashedPasswordBcrypt = await bcrypt.hash(newPassword, salt);
          await this.adminProfileRepository.update(admin.id, {
            ...admin,
            salt,
            password: hashedPasswordBcrypt,
          });

          await this.redis.del(keyRedis);

          await this.mailService.sendChangePasswordSuccessEmail(admin.email, admin.firstName + ' ' + admin.lastName);
        } else if (agency) {
          const salt = await bcrypt.genSalt(10);
          const hashedPasswordBcrypt = await bcrypt.hash(newPassword, salt);
          await this.agencyRepository.update(agency.id, {
            ...agency,
            salt,
            password: hashedPasswordBcrypt,
            resetPasswordDefaut: true
          });

          await this.redis.del(keyRedis);

          await this.mailService.sendChangePasswordSuccessEmail(agency.email, agency.firstName + ' ' + agency.lastName);
        }
        return true;
      } else {
        throw new BadRequestException('Time out, please try reset password process again!');
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async OTPEmailValidate(param: OTPEmailDTO, key = ''): Promise<boolean> {
    const { email, otpCode } = param;
    const keyRedis = `user:${email}:${key}`;
    const otpCodeRedis = await this.redis.get(`${keyRedis}`);

    if ((otpCodeRedis && otpCodeRedis === otpCode) || (process.env.ENVIRONMENT === 'stagging' && otpCode === '111111')) {
      return true;
    } else {
      if (key === 'REDIS_KEY_SIGNIN') {
        const keyWrongOTP = `wrongOTP:user:${email}:${key}:${otpCode}`;
        const count = await this.redis.get(`${keyWrongOTP}`);
        if (count) {
          await this.redis.incr(`${keyWrongOTP}`);
        } else {
          await this.redis.setex(keyWrongOTP, 60 * 60, 1);
        }
        throw BaseError.OTP_FAIL_WITHOUT_COUNT_WRONG_OTP();
      }
      return false;
    }
  }

  async deleteRedisByKey(email, key) {
    const keyRedis = `user:${email}:${key}`;
    try {
      await this.redis.del(keyRedis);
      return true;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async validatePassword(password: string, DBpassword: string): Promise<boolean> {
    console.log('password', password);
    console.log('DBpassword', DBpassword);

    return bcrypt.compare(password, DBpassword);
  }

  async validateEmailPassword(userData: { id: string, password: string, email: string, firstName: string, lastName: string, status: string }, password: string, role: string): Promise<boolean> {

    const match = await this.validatePassword(password, userData.password);

    const countWrongPassword = await this.redis.get('adminportal:wrongpassword:' + userData.email + ':lock');
    const PERIOD_ACCOUNT_LOCK_HOUR = parseInt(process.env.PERIOD_ACCOUNT_LOCK) / 3600;
    if (countWrongPassword && parseInt(countWrongPassword) == 5) {
      throw new HttpException(
        {
          wrongOtp: parseInt(countWrongPassword) + 1,
          message: `Your account was locked for ${PERIOD_ACCOUNT_LOCK_HOUR} hour. Please try later`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!match) {
      if (!countWrongPassword) {
        await this.redis.setex('adminportal:wrongpassword:' + userData.email + ':lock', parseInt(process.env.PERIOD_ACCOUNT_LOCK), 1);
        throw new HttpException(
          {
            wrongOtp: 1,
            message: 'Your email and password do not match. Please try again.',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else if (countWrongPassword && parseInt(countWrongPassword) <= 4) {
        await this.redis.setex('adminportal:wrongpassword:' + userData.email + ':lock', parseInt(process.env.PERIOD_ACCOUNT_LOCK), parseInt(countWrongPassword) + 1);
        if (parseInt(countWrongPassword) + 1 == 5) {
          this.mailService.sendTemporarilyLockAccountEmail(
            userData.email,
            userData.firstName + ' ' + userData.lastName,
          );
          if (role === ROLE.SUPER_ADMIN) {
            await this.adminProfileRepository.update(userData.id, {
              status: ACCOUNT_STATUS.LOCKED
            });
          } else if (role === ROLE.AGENT) {
            await this.agencyRepository.update(userData.id, {
              status: AGENCY_STATUS.LOCKED
            });
          }

          throw new HttpException(
            {
              wrongOtp: parseInt(countWrongPassword) + 1,
              message: `Your account was locked for ${PERIOD_ACCOUNT_LOCK_HOUR} hour. Please try later for ${PERIOD_ACCOUNT_LOCK_HOUR} hour. Please try later`,
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        throw new HttpException(
          {
            wrongOtp: parseInt(countWrongPassword) + 1,
            message: 'Your email and password do not match. Please try again.',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else if (countWrongPassword && parseInt(countWrongPassword) == 5) {
        throw new HttpException(
          {
            wrongOtp: parseInt(countWrongPassword) + 1,
            message: `Your account was locked for ${PERIOD_ACCOUNT_LOCK_HOUR} hour. Please try later`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      return;
    } else if (match) {
      if (countWrongPassword && parseInt(countWrongPassword) == 5) {
        throw new HttpException(
          {
            wrongOtp: parseInt(countWrongPassword) + 1,
            message: `Your account was locked for ${PERIOD_ACCOUNT_LOCK_HOUR} hour. Please try later for ${PERIOD_ACCOUNT_LOCK_HOUR} hour. Please try later`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (role === ROLE.SUPER_ADMIN && userData.status === ACCOUNT_STATUS.LOCKED) {
        await this.adminProfileRepository.update(userData.id, {
          status: ACCOUNT_STATUS.ACTIVE
        });
      } else if (role === ROLE.AGENT && userData.status === AGENCY_STATUS.LOCKED) {
        await this.agencyRepository.update(userData.id, {
          status: AGENCY_STATUS.ACTIVE
        });
      }
      return true;
    }
  }

  async generateTokenAdmin(user: UserAccessTokenClaims): Promise<AuthTokenOutput> {
    try {
      const subject = { sub: user.id, roles: user.roles, };
      const payload = {
        email: user.email,
        sub: user.id,
        roles: user.roles,
      };
      const authToken = {
        refreshToken: this.jwtService.sign(subject, {
          secret: process.env.JWT_REFRESH_TOKEN_SECRET,
          expiresIn: parseInt(process.env.JWT_REFRESH_TOKEN_EXP_IN_SEC) + 's',
        }),
        accessToken: this.jwtService.sign(
          { ...payload, ...subject },
          {
            secret: process.env.JWT_ACCECC_TOKEN_SECRET,
            expiresIn: parseInt(process.env.JWT_ACCESS_TOKEN_EXP_IN_SEC) + 's',
          },
        ),
        user: user,
      };
      return plainToClass(AuthTokenOutput, authToken, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getAdminByToken(id: string): Promise<AdminProfile> {
    return await this.adminProfileRepository.findOne({
      where: { id },
      relations: {
        role: true,
      },
    });
  }

  //save accessToken, refreshToken to redis
  // async saveAccessTokenAndRefreshTokenToRedis(data : {email: string, accessToken: string, refreshToken: string}) {
  //   try {
  //     await this.redis.hset(data.email, data)

  //     return true;
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }
}
