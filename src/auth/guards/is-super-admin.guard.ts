// src/modules/users/users.controller.ts

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ROLE } from '../constants/role.constant';

@Injectable()
export class IsSuperAdmin implements CanActivate {

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log('IsSuperAdmin', request.user);
    if (request?.user?.roles && request?.user?.roles.includes(ROLE.SUPER_ADMIN)) {
      return true;
    }
    return false;

    // const admin = await this.adminProfileRepository.findOne({
    //   where: {
    //     id: request.user.sub,
    //     email: request.user.email,
    //     role: {
    //       isSuperAdmin: true
    //     }
    //   },
    // });
    // if (admin) return true;
    // return false;
    return true;
  }
}
