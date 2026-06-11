import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { username }, 
      select: { id: true, username: true, password: true, role: true } 
    });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async addZaoWuBi(userId: number, amount: number): Promise<User> {
    const user = await this.findOneById(userId);
    if (!user) throw new Error('User not found');
    user.zaowuBiBalance = Number(user.zaowuBiBalance) + amount;
    return this.usersRepository.save(user);
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }
}
