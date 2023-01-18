import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskForceDto } from './create-task-force.dto';

export class UpdateTaskForceDto extends PartialType(CreateTaskForceDto) {}
