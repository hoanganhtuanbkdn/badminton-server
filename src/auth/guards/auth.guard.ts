import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/shared/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('isPublic', isPublic);

    // if (isPublic) {
    //   return true;
    // }

    const request = context.switchToHttp().getRequest();
    // const route = request.route.path.split('/')[4];
    // // if (
    // //   route === 'agencies' ||
    // //   route === 'team-agencies' ||
    // //   route === 'agency-reviews' ||
    // //   route === 'agency-contacts'
    // // ) {
    // //   return true;
    // // }
    console.log('isPublic', isPublic);

    const token = this.extractTokenFromHeader(request);
    if (!token && !isPublic) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCECC_TOKEN_SECRET,
      });
      request['user'] = payload;
    } catch {
      if (isPublic) {
        return true;
      }

      throw new UnauthorizedException();
    }
    console.log('user', request['user']);

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
