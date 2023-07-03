import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
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

    const user = await this.findOne(createUserDto.username);
    if (user) {
      throw new HttpException(
        'This username already exists!',
        HttpStatus.BAD_REQUEST
      )
    } else {
      // return createUserDto;
      return this.userRepository.save(createUserDto);
    }

  }

  async findOne(username: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { username: username },
      relations: { roles: true },
    });
  }

  async findAllAdmins() {
    return this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .where('role.name = :roleName', { roleName: 'ADMIN' })
      .getMany();
  }
}
