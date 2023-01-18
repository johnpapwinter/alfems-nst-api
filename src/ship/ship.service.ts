import { Injectable } from '@nestjs/common';
import { CreateShipDto } from './dto/create-ship.dto';
import { UpdateShipDto } from './dto/update-ship.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ship } from './entities/ship.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShipService {
  constructor(
    @InjectRepository(Ship)
    private shipRepository: Repository<Ship>,
  ) {}

  async create(createShipDto: CreateShipDto) {
    return this.shipRepository.save(createShipDto);
  }

  async findAll(): Promise<Ship[]> {
    return this.shipRepository.find();
  }

  async findOne(id: string): Promise<Ship> {
    return this.shipRepository.findOneBy({ id });
  }

  async update(id: string, updateShipDto: UpdateShipDto) {
    return this.shipRepository.update(id, updateShipDto);
  }

  async remove(id: string) {
    return this.shipRepository.delete(id);
  }
}
