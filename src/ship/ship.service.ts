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

@Injectable()
export class ShipService {
  constructor(
    @InjectRepository(Ship)
    private shipRepository: Repository<Ship>,
  ) {}

  async create(createShipDto: CreateShipDto) {
    return this.shipRepository.save(createShipDto);
  }

  async getAll(options: IPaginationOptions): Promise<Pagination<Ship>> {
    return paginate<Ship>(this.shipRepository, options);
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
}
