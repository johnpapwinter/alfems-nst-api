import { Module } from '@nestjs/common';
import { ShipService } from './ship.service';
import { ShipController } from './ship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ship } from './entities/ship.entity';
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "../auth/role/roles.guard";
import { JwtService } from "@nestjs/jwt";
import { ShipAudit } from "./entities/ship.audit.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Ship, ShipAudit])],
  controllers: [ShipController],
  providers: [
    ShipService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    JwtService
  ],
})
export class ShipModule {}
