import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from "./public.decorator";

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Public()
  @Post('signup')
  async signupUser(@Body() newUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    newUserDto.password = await bcrypt.hash(newUserDto.password, salt);

    return this.userService.create(newUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

}
