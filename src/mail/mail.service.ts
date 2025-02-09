import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, RequestTimeoutException } from '@nestjs/common';

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
        html: `
                <h1>Login notification</h1>
                <p>You have logged in to your account at ${today.toLocaleString()}</p>
              `,
      });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException();
    }
  }
}
