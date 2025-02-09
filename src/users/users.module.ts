import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './Entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule and ConfigService if not already imported
import { AuthProvider } from './auth.provider';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    MailModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION'), // Correct usage of expiresIn
        },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthProvider],
  exports: [UsersService]
})
export class UsersModule {}
