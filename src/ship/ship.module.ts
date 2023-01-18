import { Module } from '@nestjs/common';
import { ShipService } from './ship.service';
import { ShipController } from './ship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ship } from './entities/ship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ship])],
  controllers: [ShipController],
  providers: [ShipService],
})
export class ShipModule {}
