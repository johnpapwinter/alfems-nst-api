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
    ShipModule,
    TaskForceModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtService
  ],
})
export class AppModule {}
