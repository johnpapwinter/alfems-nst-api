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
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async signupUser(@Body() newUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    newUserDto.password = await bcrypt.hash(newUserDto.password, salt);

    return this.userService.create(newUserDto);
  }

  @Post('signin')
  async loginUser(@Body() loginUserDto: CreateUserDto) {
    // console.log(loginUserDto);
    const user = await this.userService.findOne(loginUserDto.username);
    console.log('controller method');
    console.log(user);
    console.log(user.roles);
    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (isMatch) {
      return `Logged in ${loginUserDto.username}`;
    } else {
      return `Unauthorized`;
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    console.log('-----------------------');
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
