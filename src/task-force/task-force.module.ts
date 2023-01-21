import { Module } from '@nestjs/common';
import { TaskForceService } from './task-force.service';
import { TaskForceController } from './task-force.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskForce } from './entities/task-force.entity';
import { Ship } from '../ship/entities/ship.entity';
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "../auth/role/roles.guard";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forFeature([TaskForce, Ship])],
  controllers: [TaskForceController],
  providers: [
    TaskForceService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    JwtService
  ],
})
export class TaskForceModule {}
