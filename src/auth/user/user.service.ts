import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { RoleEnum } from '../role/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const name = RoleEnum.User;
    const role = await this.roleRepository.findOneBy({ name });
    createUserDto.roles = [];
    createUserDto.roles.push(role);
    console.log(createUserDto);
    return null;
    // return this.userRepository.create(createUserDto);
  }

  async findOne(username: string) {
    return await this.userRepository.findOneBy({ username });
  }
}
