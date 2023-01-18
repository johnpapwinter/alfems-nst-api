import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskForceService } from './task-force.service';
import { CreateTaskForceDto } from './dto/create-task-force.dto';
import { UpdateTaskForceDto } from './dto/update-task-force.dto';

@Controller('task-force')
export class TaskForceController {
  constructor(private readonly taskForceService: TaskForceService) {}

  @Post()
  create(@Body() createTaskForceDto: CreateTaskForceDto) {
    return this.taskForceService.create(createTaskForceDto);
  }

  @Get()
  findAll() {
    return this.taskForceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskForceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskForceDto: UpdateTaskForceDto) {
    return this.taskForceService.update(+id, updateTaskForceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskForceService.remove(+id);
  }
}
