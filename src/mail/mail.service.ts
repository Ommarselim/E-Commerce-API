import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, RequestTimeoutException } from '@nestjs/common';
import e from 'express';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendLoginEmail(email: string) {
    try {
      const today = new Date();
      console.log('🔍 Sending test email...');
      console.log(email);

      await this.mailerService.sendMail({
        to: email,
        from: `<no-replay@my-nestjs-app.com`,
        subject: 'Login notification',
        template: 'login',
        context: {
          date: today,
          email: email,
        },
      });
      console.log('✅ Email sent successfully');
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException();
    }
  }


  async sendVerifyEmailTemplate(email: string, link: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: `<no-replay@my-nestjs-app.com`,
        subject: 'Verify Your Account notification',
        template: 'verify-email',
        context: {
          link,
        },
      });
      console.log('✅ Email sent successfully');
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException();
    }
  }
}
