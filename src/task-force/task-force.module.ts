import { Module } from '@nestjs/common';
import { TaskForceService } from './task-force.service';
import { TaskForceController } from './task-force.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskForce } from './entities/task-force.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskForce])],
  controllers: [TaskForceController],
  providers: [TaskForceService],
})
export class TaskForceModule {}
