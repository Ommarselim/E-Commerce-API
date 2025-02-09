import { MailService } from './../mail/mail.service';
import { LoginDto } from './dtos/login.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './Entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dtos/register.dto';
import { JwtService } from '@nestjs/jwt';
import { JWTPayloadType, TokenType } from 'src/utilities/types';
import { randomBytes } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthProvider {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async register(userData: RegisterDto) {
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
      verificationToken: randomBytes(32).toString('hex'),
    });
    newUser = await this.usersRepository.save(newUser);
    const link = this.generateLink(newUser.id, newUser.verificationToken);
    await this.mailService.sendVerifyEmailTemplate(email, link);

    return {
      message:
        'Verification token has been sent to your email, please verify you account!',
    };
  }

  /**
   *
   * @param LoginDto
   * @returns  {Promise<TokenType>}
   */
  async login(LoginDto: LoginDto) {
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

    if (!user.isVerified) {
      let verificationToken = user.verificationToken;
      if (!verificationToken) {
        user.verificationToken = randomBytes(32).toString('hex');
        const result = await this.usersRepository.save(user);
        verificationToken = result.verificationToken;
      }
      const link = this.generateLink(user.id, verificationToken);
      await this.mailService.sendVerifyEmailTemplate(email, link);
      return {
        message:
          'Verification token has been sent to your email, please verify you account!',
      };
    }

    const token = await this.generateJWT({
      userId: user.id,
      role: user.role,
    });

    return { token };
  }

  private generateJWT(payload: JWTPayloadType): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  //${this.configService.get('DOMAIN')}/api/users/verify-email/${newUser.id}/${newUser.verificationToken}
  private generateLink(userId: number, verificationToken: string | null) {
    return `${this.configService.get('DOMAIN')}/api/users/verify-email/${userId}/${verificationToken}`;
  }
}
