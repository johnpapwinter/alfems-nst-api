import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShipModule } from './ship/ship.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ship } from './ship/entities/ship.entity';
import { TaskForceModule } from './task-force/task-force.module';
import { TaskForce } from "./task-force/entities/task-force.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'alfemsdb',
      entities: [Ship, TaskForce],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ShipModule,
    TaskForceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
