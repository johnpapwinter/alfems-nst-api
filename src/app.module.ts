import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShipModule } from './ship/ship.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ship } from './ship/entities/ship.entity';
import { TaskForceModule } from './task-force/task-force.module';
import { TaskForce } from './task-force/entities/task-force.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user/entities/user.entity';
import { Role } from './auth/role/entities/role.entity';
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { JwtService } from "@nestjs/jwt";
import { ShipAudit } from "./ship/entities/ship.audit.entity";
import { AuditingSubscriber } from "typeorm-auditing";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { ScheduleModule } from "@nestjs/schedule";
import { MailModule } from './mail/mail.module';
import { TasksService } from "./tasks/tasks.service";
import { join } from 'path';
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./src/.env`
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
          type: 'postgres',
          host: config.get('DB_HOST'),
          port: config.get('DB_PORT'),
          username: config.get('DB_USERNAME'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_NAME'),
          entities: [Ship, TaskForce, User, Role, ShipAudit],
          subscribers: [AuditingSubscriber],
          synchronize: true,
          autoLoadEntities: true
        }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST'),
          port: configService.get('SMTP_PORT'),
          secure: false,
          auth: {
            user: configService.get('SMTP_USERNAME'),
            pass: configService.get('SMTP_PASSWORD'),
          }
        },
        defaults: {
          from: configService.get('EMAIL_SENDER')
        },
        template: {
          dir: join(__dirname, '../src/mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        }
      }),
      inject: [ConfigService]
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('THROTTLE_TTL'),
        limit: config.get('THROTTLE_LIMIT'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    ShipModule,
    TaskForceModule,
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    JwtService,
    TasksService
  ],
})
export class AppModule {}
