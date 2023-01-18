import { Injectable } from '@nestjs/common';
import { CreateTaskForceDto } from './dto/create-task-force.dto';
import { UpdateTaskForceDto } from './dto/update-task-force.dto';

@Injectable()
export class TaskForceService {
  create(createTaskForceDto: CreateTaskForceDto) {
    return 'This action adds a new taskForce';
  }

  findAll() {
    return `This action returns all taskForce`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taskForce`;
  }

  update(id: number, updateTaskForceDto: UpdateTaskForceDto) {
    return `This action updates a #${id} taskForce`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskForce`;
  }
}
