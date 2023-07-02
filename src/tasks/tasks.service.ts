import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { MailService } from "../mail/mail.service";
import { ShipService } from "../ship/ship.service";
import { UserService } from "../auth/user/user.service";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private mailService: MailService,
              private shipService: ShipService,
              private userService: UserService) {
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleEndOfMonthTask() {
    this.logger.debug('End of Month Task');

    const xlsBuffer = await this.shipService.exportUnassignedShipsToExcel();
    const adminUsers = await this.userService.findAllAdmins();

    await this.mailService.sendUnassignedShipsEmail(
      xlsBuffer,
      'unassigned_ship.xlsx',
      adminUsers.map(user => user.username)
    );
  }

}
