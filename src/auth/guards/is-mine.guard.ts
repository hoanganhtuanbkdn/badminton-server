// src/modules/users/users.controller.ts

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isString } from 'lodash';
import { Agency } from 'src/agency/entities/agency.entity';
import { Repository } from 'typeorm';
import { ROLE } from '../constants/role.constant';

@Injectable()
export class IsMineGuard implements CanActivate {
  constructor(
    @InjectRepository(Agency)
    private agencyRepository: Repository<Agency>,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 💡 We can access the user payload from the request object
    // because we assigned it in the AuthGuard
    // 💡 Get instance of the route by splitting the path, e.g. /posts/1
    console.log('request.route.path', request.route.path);
    if (request?.user?.roles?.includes(ROLE.SUPER_ADMIN)) {
      return true;
    }
    const route = request.route.path.split('/')[4];

    const paramId = request?.params?.id ? request.params.id : 0;
    switch (route) {
      // 💡 Check if the post belongs to the user
      case 'agencies':
        const agency = await this.agencyRepository.findOne({
          where: {
            id: paramId,
          },
        });
        console.log('paramId', paramId);
        console.log('agency', agency);
        return request.user.sub === agency?.id;
      case 'team-agencies':
        return request.user.sub === agency?.id;
      case 'agency-reviews':
        return request.user.sub === agency?.id;
      case 'agency-contacts':
        return request.user.sub === agency?.id;
      case 'agency-leads':
        return request.user.sub === agency?.id;
      case 'team-agencies':
        return request.user.sub === agency?.id;
      default:
        // 💡 Check if the user manages its own profile
        return paramId === request.user.sub;
    }
  }
}
