import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Put,
  UseGuards, Res
} from "@nestjs/common";
import { TaskForceService } from './task-force.service';
import { CreateTaskForceDto } from './dto/create-task-force.dto';
import { UpdateTaskForceDto } from './dto/update-task-force.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { TaskForce } from './entities/task-force.entity';
import { Ship } from '../ship/entities/ship.entity';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/role/roles.decorator';
import { RoleEnum } from '../auth/role/role.enum';
import { RolesGuard } from '../auth/role/roles.guard';
import { Response } from 'express';

@Controller('task-force')
export class TaskForceController {
  constructor(private readonly taskForceService: TaskForceService) {}

  @Roles(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() createTaskForceDto: CreateTaskForceDto) {
    return this.taskForceService.create(createTaskForceDto);
  }

  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<TaskForce>> {
    return this.taskForceService.getAll({ page, limit });
  }

  @Get('/test')
  async getAllTest(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<TaskForce>> {
    return this.taskForceService.getAllTest({ page, limit });
  }

  @Get('/all')
  async findAll() {
    return this.taskForceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.taskForceService.findOne(id);
  }

  @Get('/name/:name')
  async findByName(@Param('name') name: string) {
    return await this.taskForceService.findByName(name);
  }

  @Roles(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskForceDto: UpdateTaskForceDto,
  ) {
    return await this.taskForceService.update(id, updateTaskForceDto);
  }

  @Roles(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.taskForceService.remove(id);
  }

  @Roles(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Put('assign/:tfId/:shipId')
  async assignVessel(
    @Param('tfId') tfId: string,
    @Param('shipId') shipId: string,
  ) {
    return this.taskForceService.assignVessel(tfId, shipId);
  }

  @Roles(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Put('remove/:tfId/:shipId')
  async removeVessel(
    @Param('tfId') tfId: string,
    @Param('shipId') shipId: string,
  ) {
    return this.taskForceService.removeVessel(tfId, shipId);
  }

  @Roles(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Get(':id/vessels')
  async getAllOfTaskForce(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Ship>> {
    return this.taskForceService.getAllOfTaskForce(id, { page, limit });
  }

  @Get(':id/export')
  async exportToExcel(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.taskForceService.exportTaskForceToExcel(id);

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename=tf_${id}_list.xlsx`,
    })
    res.send(buffer);
  }
}
