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

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService, // Inject ConfigService properly
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) return false;

    const [type, token] = authHeader.split(' ') ?? [];

    if (type !== 'Bearer' || !token) return false;

    try {
      const payload: JWTPayloadType = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'), // Corrected usage
      });
      request[CURRENT_USER_KEY] = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token'); // More explicit error handling
    }
  }
}
