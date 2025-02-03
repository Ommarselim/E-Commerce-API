import { Body, Controller, Post, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dtos/register.dto';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async register(@Body() registerdto: RegisterDto) {
    return this.usersService.register(registerdto);
  }

  @Get()
    async getUsers() {
        return this.usersService.getUsers();
    }

}
