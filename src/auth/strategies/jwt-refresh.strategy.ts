import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserRefreshTokenClaims } from '../dtos/auth-token-output.dto';
import { STRATEGY_JWT_REFRESH } from './strategy.constant';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, STRATEGY_JWT_REFRESH) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async validate(request: Request, payload: any): Promise<UserRefreshTokenClaims> {
    console.log('payload123', payload);
    // Passport automatically creates a user object, based on the value we return from the validate() method,
    // and assigns it to the Request object as req.user

    return {
      id: payload.sub,
      roles: payload.roles,
    };
  }
}
