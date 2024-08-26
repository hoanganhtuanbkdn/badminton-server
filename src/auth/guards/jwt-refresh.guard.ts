import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGY_JWT_REFRESH } from '../strategies';


@Injectable()
export class JwtRefreshGuard extends AuthGuard(STRATEGY_JWT_REFRESH) { }
