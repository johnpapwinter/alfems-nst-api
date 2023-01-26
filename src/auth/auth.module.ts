import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Role } from './role/entities/role.entity';
import { UserService } from './user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './role/roles.guard';

@Module({
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  imports: [
    UserModule,
    RoleModule,
    PassportModule,
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10080m' },
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
