import { Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOne(username);
    console.log('VALIDATE');
    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const roleNames = user.roles.map((role) => role.name);
    const payload = { username: user.username, roles: roleNames };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
