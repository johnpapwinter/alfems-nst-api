import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  // SIGNUP
  @Post()
  async signupUser(@Body() newUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    newUserDto.password = await bcrypt.hash(newUserDto.password, salt);

    return this.userService.create(newUserDto);
  }

  // LOGIN
}
