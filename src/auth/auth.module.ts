import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Role } from './role/entities/role.entity';
import { UserService } from './user/user.service';

@Module({
  providers: [AuthService, UserService],
  imports: [UserModule, RoleModule, TypeOrmModule.forFeature([User, Role])],
  controllers: [AuthController],
})
export class AuthModule {}
