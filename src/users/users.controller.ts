import { AuthRolesGuard } from './guards/auth-roles.guard';
import { CURRENT_USER_KEY } from './../utilities/constants';
import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  NotFoundException,
  Put,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dtos/register.dto';
import { AuthGuard } from './guards/auth.guard';
import { JWTPayloadType } from 'src/utilities/types';
import { Request } from 'express';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from 'src/utilities/enums';
import { UpdateUserDto } from './dtos/update-user.dto';
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
      throw new NotFoundException('payload not found');
    }
    return this.usersService.getCurrentUser(payload.userId);
  }

  @Get('/only-admin')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  async getUsers() {
    return this.usersService.getUsers();
  }
  @Put('/:id')
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() payload: JWTPayloadType,
  ) {
    return this.usersService.updateUser(id, updateUserDto, payload);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('id', ParseIntPipe) id: number , @CurrentUser() payload: JWTPayloadType) {
    return this.usersService.deleteUser(id , payload);
  }
}
