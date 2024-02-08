import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async createUser({
    password,
    username,
    email,
  }: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      email,
    });

    return this.userRepository.save(user);
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { username },
    });
  }
}
