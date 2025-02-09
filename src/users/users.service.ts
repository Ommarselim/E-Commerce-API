import { LoginDto } from './dtos/login.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './Entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dtos/register.dto';
import { JwtService } from '@nestjs/jwt';
import { JWTPayloadType, TokenType } from 'src/utilities/types';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthProvider } from './auth.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly authprovider: AuthProvider,
  ) {}

  async create(userData: RegisterDto) {
    return this.authprovider.register(userData);
  }
  async login(LoginDto: LoginDto) {
    return this.authprovider.login(LoginDto);
  }

  async getUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async getCurrentUser(userId: number): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(
    userId: number,
    updateData: UpdateUserDto,
    payload: JWTPayloadType,
  ): Promise<User> {
    if (payload.role !== 'admin' && userId !== payload.userId) {
      throw new BadRequestException('You can only update your account');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    Object.assign(user, updateData);
    return this.usersRepository.save(user);
  }

  async deleteUser(
    userId: number,
    payload: JWTPayloadType,
  ): Promise<{ message: string }> {
    if (userId !== payload.userId && payload.role !== 'admin') {
      throw new BadRequestException('You can only delete your account');
    }
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.delete(userId);
    return { message: 'User deleted successfully' };
  }

  async verifyEmail(id: number, token: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.verificationToken || user.verificationToken !== token) {
      throw new NotFoundException('Invalid Link!');
    }
    user.isVerified = true;
    user.verificationToken = null;
    await this.usersRepository.save(user);
    return { message: 'Email verified successfully, please Login.' };
  }
}
