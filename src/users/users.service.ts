import { LoginDto } from './dtos/login.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './Entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(userData: RegisterDto): Promise<User> {
    const { email, password } = userData;
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return this.usersRepository.save(newUser);
  }

  async login(LoginDto: LoginDto): Promise<User> {
    const { email, password } = LoginDto;
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }
    return user;
  }


  async getUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }


}
