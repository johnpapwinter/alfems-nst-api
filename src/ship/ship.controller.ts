import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ShipService } from './ship.service';
import { CreateShipDto } from './dto/create-ship.dto';
import { UpdateShipDto } from './dto/update-ship.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Ship } from './entities/ship.entity';

@Controller('ship')
export class ShipController {
  constructor(private readonly shipService: ShipService) {}

  @Post()
  async create(@Body() createShipDto: CreateShipDto) {
    return this.shipService.create(createShipDto);
  }

  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Ship>> {
    return this.shipService.getAll({ page, limit });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.shipService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateShipDto: UpdateShipDto) {
    return await this.shipService.update(id, updateShipDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.shipService.remove(id);
  }
}
