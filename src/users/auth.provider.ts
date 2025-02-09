import { MailService } from './../mail/mail.service';
import { LoginDto } from './dtos/login.dto';
import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './Entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dtos/register.dto';
import { JwtService } from '@nestjs/jwt';
import { JWTPayloadType, TokenType } from 'src/utilities/types';

@Injectable()
export class AuthProvider {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
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

  /**
   *
   * @param LoginDto
   * @returns  {Promise<TokenType>}
   */
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

    await this.mailService.sendLoginEmail(email);

    return { token };
  }

  private generateJWT(payload: JWTPayloadType): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
