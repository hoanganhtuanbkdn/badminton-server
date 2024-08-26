import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserAccessTokenClaims } from '../dtos/auth-token-output.dto';
import { STRATEGY_JWT_AUTH } from './strategy.constant';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, STRATEGY_JWT_AUTH) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCECC_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async validate(request: Request, payload: any): Promise<UserAccessTokenClaims> {
    // return false;
    // Passport automatically creates a user object, based on the value we return from the validate() method,
    // and assigns it to the Request object as req.user
    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
