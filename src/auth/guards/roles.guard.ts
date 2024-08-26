import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLE } from '../constants/role.constant';
import { ROLES_KEY } from '../decorators/role.decorator';
import { IS_PUBLIC_KEY } from 'src/shared/decorators/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ROLE[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    console.log('requiredRoles', requiredRoles);
    console.log('user', user);

    if (requiredRoles.some((role) => user.roles?.includes(role))) {
      return true;
    }

    throw new UnauthorizedException(
      `User with roles ${user.roles} does not have access to this route with roles ${requiredRoles}`,
    );
  }
}
