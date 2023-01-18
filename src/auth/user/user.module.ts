import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';

@Module({
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([User, Role])],
})
export class UserModule {}
