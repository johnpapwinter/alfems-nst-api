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
} from '@nestjs/common';
import { TaskForceService } from './task-force.service';
import { CreateTaskForceDto } from './dto/create-task-force.dto';
import { UpdateTaskForceDto } from './dto/update-task-force.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { TaskForce } from './entities/task-force.entity';

@Controller('task-force')
export class TaskForceController {
  constructor(private readonly taskForceService: TaskForceService) {}

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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.taskForceService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskForceDto: UpdateTaskForceDto,
  ) {
    return await this.taskForceService.update(id, updateTaskForceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.taskForceService.remove(id);
  }
}
