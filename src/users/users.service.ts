import { LoginDto } from './dtos/login.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChildEntity, Repository } from 'typeorm';
import { User } from './Entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dtos/register.dto';
import { JwtService } from '@nestjs/jwt';
import { JWTPayloadType, TokenType } from 'src/utilities/types';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(userData: RegisterDto): Promise<TokenType> {
    const { email, password } = userData;
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });
    newUser = await this.usersRepository.save(newUser);
    const token = await this.generateJWT({
      userId: newUser.id,
      role: newUser.role,
    });
    return { token };
  }

  async login(LoginDto: LoginDto): Promise<TokenType> {
    const { email, password } = LoginDto;
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    // console.log(user);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }
    const token = await this.generateJWT({
      userId: user.id,
      role: user.role,
    });
    return { token };
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

  private generateJWT(payload: JWTPayloadType): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
