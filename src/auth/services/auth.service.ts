import { BadRequestException, Injectable } from '@nestjs/common';
import { AppLogger } from 'src/shared/logger/logger.service';
import { RequestContext } from 'src/shared/request-context/request-context.dto';
import { AuthTokenOutput, UserAccessTokenClaims } from '../dtos/auth-token-output.dto';
import { plainToClass } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: AppLogger,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.logger.setContext(AuthService.name);
  }

  getAuthToken(ctx: RequestContext, user: UserAccessTokenClaims): any {
    this.logger.log(ctx, `${this.getAuthToken.name} was called`);
    try {
      const subject = { sub: user.id };
      const payload = {
        email: user.email,
        sub: user.id,
        roles: user.roles,
      };
      const authToken = {
        refreshToken: this.jwtService.sign(subject, {
          secret: this.configService.get('jwt.JWT_ACCECC_TOKEN_SECRET'),
          expiresIn: parseInt(process.env.JWT_REFRESH_TOKEN_EXP_IN_SEC) + 's',
        }),
        accessToken: this.jwtService.sign(
          { ...payload, ...subject },
          {
            secret: this.configService.get('jwt.JWT_ACCECC_TOKEN_SECRET'),
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
}
