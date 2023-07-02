import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateShipDto } from './dto/create-ship.dto';
import { UpdateShipDto } from './dto/update-ship.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ship } from './entities/ship.entity';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { SearchShipDto } from './dto/search-ship.dto';
import * as ExcelJS from "exceljs";

@Injectable()
export class ShipService {
  constructor(
    @InjectRepository(Ship)
    private shipRepository: Repository<Ship>,
  ) {}

  async create(createShipDto: CreateShipDto) {
    const ship = await this.shipRepository.findOneBy({
      name: createShipDto.name,
    });
    if (ship && ship.hud === createShipDto.hud) {
      throw new HttpException(
        'The ship is already in the registry',
        HttpStatus.FOUND,
      );
    }

    return this.shipRepository.save(createShipDto);
  }

  async getAll(
    options: IPaginationOptions,
    sortBy: string,
    sortOrder: number,
  ): Promise<Pagination<Ship>> {
    const queryBuilder = this.shipRepository.createQueryBuilder('ship');
    // @ts-ignore
    if (<string>sortOrder === '1') {
      queryBuilder.orderBy(`ship.${sortBy}`, 'ASC');
    } else {
      queryBuilder.orderBy(`ship.${sortBy}`, 'DESC');
    }
    return paginate<Ship>(queryBuilder, options);
  }

  async getAllUnassigned(
    options: IPaginationOptions,
    sortBy: string,
    sortOrder: number,
  ): Promise<Pagination<Ship>> {
    const queryBuilder = this.shipRepository.createQueryBuilder('ship');
    queryBuilder.where('ship.taskForceId IS NULL');
    // @ts-ignore
    if (<string>sortOrder === '1') {
      queryBuilder.orderBy(`ship.${sortBy}`, 'ASC');
    } else {
      queryBuilder.orderBy(`ship.${sortBy}`, 'DESC');
    }
    return paginate<Ship>(queryBuilder, options);
  }

  async findAll(): Promise<Ship[]> {
    return await this.shipRepository.find({
      order: { name: 'ASC' },
      relations: { taskForce: true },
    });
  }

  async findOne(id: string): Promise<Ship> {
    const ship = await this.shipRepository.findOneBy({ id });
    if (!ship) {
      throw new HttpException(
        'The ship does not exist',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return this.shipRepository.findOneBy({ id });
    }
  }

  async update(id: string, updateShipDto: UpdateShipDto) {
    const ship = await this.shipRepository.findOneBy({ id });
    if (!ship) {
      throw new HttpException(
        'The ship does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.shipRepository.update(id, updateShipDto);
  }

  async remove(id: string) {
    const ship = await this.shipRepository.findOneBy({ id });
    if (!ship) {
      throw new HttpException(
        'The ship does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.shipRepository.delete(id);
  }

  async findByParams(
    searchParams: SearchShipDto,
    options: IPaginationOptions,
    sortBy: string,
    sortOrder: number,
  ): Promise<Pagination<Ship>> {
    const queryBuilder = this.shipRepository.createQueryBuilder('ship');

    if (searchParams.name !== null) {
      queryBuilder.andWhere(`ship.name = :name`, { name: searchParams.name });
    }

    if (searchParams.type !== null) {
      queryBuilder.andWhere('ship.type = :type', { type: searchParams.type });
    }

    if (searchParams.fighters !== null) {
      if (searchParams.fighters === true) {
        queryBuilder.andWhere('ship.fighters > 0');
      } else {
        queryBuilder.andWhere('ship.fighters = 0');
      }
    }

    // @ts-ignore
    if (<string>sortOrder === '1') {
      queryBuilder.orderBy(`ship.${sortBy}`, 'ASC');
    } else {
      queryBuilder.orderBy(`ship.${sortBy}`, 'DESC');
    }

    return paginate<Ship>(queryBuilder, options);
  }

  async exportUnassignedShipsToExcel() {
    const unassignedShips = await this.shipRepository.find({
      where: { taskForce: null }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Unassigned_ships`);

    const headers = ['ID', 'HUD', 'Name', 'Type', 'Crew', 'Pass', 'Ftr']
    worksheet.addRow(headers);
    worksheet.getRow(1).font = { bold: true, underline: true };
    worksheet.getRow(1).alignment = { horizontal: 'center' };

    unassignedShips.forEach(ship => {
      const values = Object.values(ship);
      worksheet.addRow(values);
    });

    worksheet.eachRow(row => {
      row.alignment= { horizontal: 'center' }
    })

    return await workbook.xlsx.writeBuffer();
  }
}
