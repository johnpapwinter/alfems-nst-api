import { Module } from '@nestjs/common';
import { TaskForceService } from './task-force.service';
import { TaskForceController } from './task-force.controller';

@Module({
  controllers: [TaskForceController],
  providers: [TaskForceService]
})
export class TaskForceModule {}
