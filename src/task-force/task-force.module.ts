import { Module } from '@nestjs/common';
import { TaskForceService } from './task-force.service';
import { TaskForceController } from './task-force.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskForce } from './entities/task-force.entity';
import { ShipService } from '../ship/ship.service';
import { Ship } from '../ship/entities/ship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskForce, Ship])],
  controllers: [TaskForceController],
  providers: [TaskForceService, ShipService],
})
export class TaskForceModule {}
