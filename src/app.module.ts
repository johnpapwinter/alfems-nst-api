import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShipModule } from './ship/ship.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ship } from './ship/entities/ship.entity';
import { TaskForceModule } from './task-force/task-force.module';
import { TaskForce } from './task-force/entities/task-force.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user/entities/user.entity';
import { Role } from './auth/role/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'alfemsdb',
      entities: [Ship, TaskForce, User, Role],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ShipModule,
    TaskForceModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
