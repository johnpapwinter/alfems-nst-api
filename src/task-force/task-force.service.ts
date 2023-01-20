import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskForceDto } from './dto/create-task-force.dto';
import { UpdateTaskForceDto } from './dto/update-task-force.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskForce } from './entities/task-force.entity';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class TaskForceService {
  constructor(
    @InjectRepository(TaskForce)
    private taskForceRepository: Repository<TaskForce>,
  ) {}

  async create(createTaskForceDto: CreateTaskForceDto) {
    return this.taskForceRepository.save(createTaskForceDto);
  }

  async findAll() {
    return `This action returns all taskForce`;
  }

  async getAll(options: IPaginationOptions): Promise<Pagination<TaskForce>> {
    return paginate<TaskForce>(this.taskForceRepository, options);
  }

  async findOne(id: string): Promise<TaskForce> {
    const taskForce = await this.taskForceRepository.findOneBy({ id });
    if (!taskForce) {
      throw new HttpException(
        'This task force does not exist',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return this.taskForceRepository.findOneBy({ id });
    }
  }

  async update(id: string, updateTaskForceDto: UpdateTaskForceDto) {
    const taskForce = await this.taskForceRepository.findOneBy({ id });
    if (!taskForce) {
      throw new HttpException(
        'This task force does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.taskForceRepository.update(id, updateTaskForceDto);
  }

  async remove(id: string) {
    const taskForce = await this.taskForceRepository.findOneBy({ id });
    if (!taskForce) {
      throw new HttpException(
        'This task force does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.taskForceRepository.delete(id);
  }
}
