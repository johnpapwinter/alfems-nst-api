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

  async sendUnassignedShipsEmail(
    xlsBuffer: Buffer,
    filename: string,
    bccRecipients: string[]
  ) {
    await this.mailerService.sendMail({
      from: this.configService.get('EMAIL_SENDER'),
      to: this.configService.get('EMAIL_SENDER'),
      bcc: bccRecipients,
      subject: 'Unassigned Ships Report',
      template: 'report_email',
      attachments: [
        {
          filename,
          content: xlsBuffer
        }
      ]
    });
  }
}
