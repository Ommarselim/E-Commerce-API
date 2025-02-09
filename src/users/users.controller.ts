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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dtos/register.dto';
import { AuthGuard } from './guards/auth.guard';
import { JWTPayloadType } from 'src/utilities/types';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from 'src/utilities/enums';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async register(@Body() registerdto: RegisterDto) {
    return this.usersService.create(registerdto);
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
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: JWTPayloadType,
  ) {
    return this.usersService.deleteUser(id, payload);
  }

  // GET: ~//api/users/verify-email/:id/:verificationToken
  @Get('/verify-email/:id/:verificationToken')
  async verifyEmail(
    @Param('id', ParseIntPipe) id: number,
    @Param('verificationToken') verificationToken: string,
  ) {
    return this.usersService.verifyEmail(id, verificationToken);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  public forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.usersService.sendResetPassword(body.email);
  }

  @Get("reset-password/:id/:resetPasswordToken")
  public getResetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Param("resetPasswordToken") resetPasswordToken: string,
  ) {
    return this.usersService.getResetPassword(id, resetPasswordToken);
  }

  @Post('reset-password')
  public resetPassword(@Body() body: ResetPasswordDto) {
    return this.usersService.resetPassword(body);
  }
}
