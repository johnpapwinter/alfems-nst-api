import { Injectable } from '@nestjs/common';
import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
// @ts-ignore
import { Buffer } from "exceljs/index";

@Injectable()
export class MailService {

  constructor(private mailerService: MailerService,
              private configService: ConfigService) {
  }

  async sendEmail(to: string, subject: string, name: string, xlsBuffer: Buffer, filename: string) {
    await this.mailerService.sendMail({
      from: this.configService.get('EMAIL_SENDER'),
      to: to,
      subject: subject,
      template: 'report_email',
      context: { name },
      attachments: [
        {
          filename,
          content: xlsBuffer
        }
      ]
    });
  }
}
