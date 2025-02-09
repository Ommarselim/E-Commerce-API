import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
@Module({
  imports: [
    ConfigModule, // Ensure ConfigModule is imported
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('SMTP_HOST'),
          port: config.get<number>('SMTP_PORT'),
          secure: false, // TLS disabled for Mailtrap
          auth: {
            user: config.get<string>('SMTP_USERNAME'),
            pass: config.get<string>('SMTP_PASSWORD'),
          },
        },
        template: {
          dir: join(process.cwd(), 'src/mail/templates'), // Absolute path from project root
          adapter: new EjsAdapter({
            inlineCssEnabled: true,
          }),
        },
      }),
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
