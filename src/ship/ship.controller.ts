import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ShipService } from './ship.service';
import { CreateShipDto } from './dto/create-ship.dto';
import { UpdateShipDto } from './dto/update-ship.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Ship } from './entities/ship.entity';
import { Roles } from '../auth/role/roles.decorator';
import { RoleEnum } from '../auth/role/role.enum';
import { RolesGuard } from '../auth/role/roles.guard';
import { SearchShipDto } from "./dto/search-ship.dto";

@Controller('ship')
export class ShipController {
  constructor(private readonly shipService: ShipService) {}

  @Roles(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() createShipDto: CreateShipDto) {
    return this.shipService.create(createShipDto);
  }

  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('sortBy') sortBy?: string,
    @Query('asc') sortOrder?: number,
  ): Promise<Pagination<Ship>> {
    return this.shipService.getAll({ page, limit }, sortBy, sortOrder);
  }

  @Get('/unassigned')
  async getAllUnassigned(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('sortBy') sortBy?: string,
    @Query('asc') sortOrder?: number,
  ): Promise<Pagination<Ship>> {
    return this.shipService.getAllUnassigned({ page, limit }, sortBy, sortOrder);
  }

  @Get('/name/:id')
  async findOne(@Param('id') id: string) {
    return await this.shipService.findOne(id);
  }

  @Roles(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateShipDto: UpdateShipDto) {
    return await this.shipService.update(id, updateShipDto);
  }

  @Roles(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.shipService.remove(id);
  }

  @Get('/all')
  async findAll() {
    return this.shipService.findAll();
  }

  @Post('/search-dynamic')
  async findByParams(
    @Body() searchParams: SearchShipDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('sortBy') sortBy?: string,
    @Query('asc') sortOrder?: number,
    ): Promise<Pagination<Ship>> {
    return this.shipService.findByParams(searchParams, { page, limit }, sortBy, sortOrder);
  }
}
