import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskForceDto } from './dto/create-task-force.dto';
import { UpdateTaskForceDto } from './dto/update-task-force.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as ExcelJS from 'exceljs';
import { TaskForce } from './entities/task-force.entity';
import { FindOptionsOrder, Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Ship } from '../ship/entities/ship.entity';
// import { Buffer } from "exceljs/index";

@Injectable()
export class TaskForceService {
  constructor(
    @InjectRepository(TaskForce)
    private taskForceRepository: Repository<TaskForce>,
    @InjectRepository(Ship)
    private shipRepository: Repository<Ship>,
  ) {}

  async create(createTaskForceDto: CreateTaskForceDto) {
    const tf = await this.taskForceRepository.findOneBy({
      name: createTaskForceDto.name,
    });
    if (tf) {
      throw new HttpException(
        'The task force already exists',
        HttpStatus.FOUND,
      );
    }
    return this.taskForceRepository.save(createTaskForceDto);
  }

  async getAll(options: IPaginationOptions): Promise<Pagination<TaskForce>> {
    return paginate<TaskForce>(this.taskForceRepository, options, {
      order: { name: 'ASC' },
    });
  }

  async getAllTest(
    options: IPaginationOptions,
  ): Promise<Pagination<TaskForce>> {
    const alpha: FindOptionsOrder<any> = {};

    const queryBuilder = this.taskForceRepository.createQueryBuilder('tf');
    queryBuilder.leftJoinAndSelect('tf.ships', 'ships').orderBy('tf.id', 'ASC');
    // queryBuilder.addFrom(Ship, 'ship')
    // .where('ship.taskForceId = tf.id')

    // return paginate(queryBuilder, options);
    return paginate<TaskForce>(this.taskForceRepository, options, {
      relations: { ships: true },
      order: { id: 'ASC' },
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

  async exportTaskForceToExcel(id: string) {
    const taskForce = await this.taskForceRepository.findOne({
      where: { id },
      relations: { ships: true },
    });
    if (!taskForce) {
      throw new HttpException('The TF does not exist', HttpStatus.NOT_FOUND);
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${taskForce.name}`);

    const headers = ['ID', 'HUD', 'Name', 'Type', 'Crew', 'Pass', 'Ftr']
    worksheet.addRow(headers);
    worksheet.getRow(1).font = { bold: true, underline: true };
    worksheet.getRow(1).alignment = { horizontal: 'center' };

    taskForce.ships.forEach(ship => {
      const values = Object.values(ship);
      worksheet.addRow(values);
    });

    worksheet.eachRow(row => {
      row.alignment= { horizontal: 'center' }
    })

    return await workbook.xlsx.writeBuffer();
  }
}
