import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskForceDto } from './dto/create-task-force.dto';
import { UpdateTaskForceDto } from './dto/update-task-force.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskForce } from './entities/task-force.entity';
import { FindOptionsOrder, Repository } from "typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Ship } from '../ship/entities/ship.entity';

@Injectable()
export class TaskForceService {
  constructor(
    @InjectRepository(TaskForce)
    private taskForceRepository: Repository<TaskForce>,
    @InjectRepository(Ship)
    private shipRepository: Repository<Ship>,
  ) {}

  async create(createTaskForceDto: CreateTaskForceDto) {
    return this.taskForceRepository.save(createTaskForceDto);
  }

  async getAll(options: IPaginationOptions): Promise<Pagination<TaskForce>> {

    return paginate<TaskForce>(
      this.taskForceRepository,
      options,
      { order: { name: "ASC" }}
    );
  }

  async getAllTest(options: IPaginationOptions): Promise<Pagination<TaskForce>> {
    let alpha: FindOptionsOrder<any> = {};

    const queryBuilder = this.taskForceRepository.createQueryBuilder('tf');
    queryBuilder.leftJoinAndSelect('tf.ships', 'ships')
      .orderBy('tf.id', 'ASC');
    // queryBuilder.addFrom(Ship, 'ship')
      // .where('ship.taskForceId = tf.id')

    // return paginate(queryBuilder, options);
    return paginate<TaskForce>(
      this.taskForceRepository,
      options,
      {
        relations: { ships: true },
        order: { id: "ASC" }
      });
  }

  async findAll(): Promise<TaskForce[]> {
    return await this.taskForceRepository.find();
  }

  async findOne(id: string): Promise<any> {
    const taskForce = await this.taskForceRepository.findOne({
      where: { id },
      relations: { ships: true },
    });
    if (!taskForce) {
      throw new HttpException(
        'This task force does not exist',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      // taskForce.ships.forEach((x) => console.log(x.name));
      return taskForce;
    }
  }

  async findByName(name: string): Promise<any> {
    const taskForce = await this.taskForceRepository.findOne({
      where: { name },
      relations: { ships: true },
    });
    if (!taskForce) {
      throw new HttpException(
        'This task force does not exist',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return taskForce;
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

    return tf;
    // return `${ship.name} was assigned to ${tf.name}`;
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

    return tf;
    // return `${ship.name} was removed from ${tf.name}`;
  }

  async getAllOfTaskForce(
    id: string,
    options: IPaginationOptions,
  ): Promise<Pagination<Ship>> {
    const tf = await this.taskForceRepository.findOneBy({ id: id });
    if (!tf) {
      throw new HttpException('The TF does not exist', HttpStatus.NOT_FOUND);
    }

    const queryBuilder = this.shipRepository
      .createQueryBuilder('ships')
      .where('ships.taskForceId = :id', { id: id });

    return paginate<Ship>(queryBuilder, options);
  }
}
