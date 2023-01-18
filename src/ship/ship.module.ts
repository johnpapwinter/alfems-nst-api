import { Module } from '@nestjs/common';
import { ShipService } from './ship.service';
import { ShipController } from './ship.controller';

@Module({
  controllers: [ShipController],
  providers: [ShipService]
})
export class ShipModule {}
