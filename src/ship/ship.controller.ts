import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShipService } from './ship.service';
import { CreateShipDto } from './dto/create-ship.dto';
import { UpdateShipDto } from './dto/update-ship.dto';

@Controller('ship')
export class ShipController {
  constructor(private readonly shipService: ShipService) {}

  @Post()
  async create(@Body() createShipDto: CreateShipDto) {
    return this.shipService.create(createShipDto);
  }

  @Get()
  async findAll() {
    return await this.shipService.findAll();
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
