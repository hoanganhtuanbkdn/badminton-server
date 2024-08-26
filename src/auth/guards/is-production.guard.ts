import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class IsProductionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    console.log('IsProductionGuard', process.env.NODE_ENV);
    return process.env.NODE_ENV !== 'development';
  }
}
