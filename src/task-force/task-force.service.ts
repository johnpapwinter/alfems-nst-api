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
import { Ship } from '../ship/entities/ship.entity';
import { ShipService } from "../ship/ship.service";

@Injectable()
export class TaskForceService {
  constructor(
    @InjectRepository(TaskForce)
    private taskForceRepository: Repository<TaskForce>,
    @InjectRepository(Ship)
    private shipRepository: Repository<Ship>,
    private shipService: ShipService,
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

  async assignVessel(tfId: string, shipId: string) {
    const ship = await this.shipRepository.findOneBy({ id: shipId });
    if (!ship) {
      throw new HttpException('The ship does not exist', HttpStatus.NOT_FOUND);
    }
    const tf = await this.taskForceRepository.findOneBy({ id: tfId });
    if (!tf) {
      throw new HttpException('The TF does not exist', HttpStatus.NOT_FOUND);
    }

    ship.taskForce = tf;
    await this.shipRepository.update(shipId, ship);

    return `${ship.name} was assigned to ${tf.name}`
  }

  async removeVessel(tfId: string, shipId: string) {
    const ship = await this.shipRepository.findOneBy({ id: shipId });
    if (!ship) {
      throw new HttpException('The ship does not exist', HttpStatus.NOT_FOUND);
    }
    const tf = await this.taskForceRepository.findOneBy({ id: tfId });
    if (!tf) {
      throw new HttpException('The TF does not exist', HttpStatus.NOT_FOUND);
    }

    ship.taskForce = null;
    await this.shipRepository.update(shipId, ship);

    return `${ship.name} was removed from ${tf.name}`
  }
}
