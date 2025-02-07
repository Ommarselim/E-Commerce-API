import { Reflector } from '@nestjs/core';
import { UsersService } from './../users.service';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JWTPayloadType } from 'src/utilities/types';
import { CURRENT_USER_KEY } from 'src/utilities/constants';
import { UserRole } from 'src/utilities/enums';

@Injectable()
export class AuthRolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService, // Inject ConfigService properly
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) return true;

    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) return false;
    const [type, token] = authHeader.split(' ') ?? [];
    if (type !== 'Bearer' || !token) return false;
    try {
      const payload: JWTPayloadType = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'), // Corrected usage
      });

      const user = await this.usersService.getCurrentUser(payload.userId);
      if (!user) return false;
      if (roles.includes(user.role)) {
        request[CURRENT_USER_KEY] = payload;
        return true;
      }
      return false;
    } catch (error) {
      throw new UnauthorizedException('Invalid token'); // More explicit error handling
    }
  }
}
