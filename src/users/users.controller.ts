import { CURRENT_USER_KEY } from './../utilities/constants';
import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dtos/register.dto';
import { AuthGuard } from './guards/auth.guard';
import { JWTPayloadType } from 'src/utilities/types';
import { Request } from 'express';
import { CurrentUser } from './decorators/current-user.decorator';
@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async register(@Body() registerdto: RegisterDto) {
    return this.usersService.register(registerdto);
  }

  @Post('/login')
  async login(@Body() registerdto: RegisterDto) {
    return this.usersService.login(registerdto);
  }

  @Get('/current-user')
    @UseGuards(AuthGuard)
  async getCurrentUser(@CurrentUser() payload: JWTPayloadType) {
    if (!payload) {
      throw new NotFoundException('KOTA not found');
    }
    return this.usersService.getCurrentUser(payload.userId);
  }

  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }
}
