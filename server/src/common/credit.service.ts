import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class CreditService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async deductCredit(userId: number, points: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      user.creditScore -= points;
      return this.userRepository.save(user);
    }
  }

  async addCredit(userId: number, points: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      user.creditScore += points;
      return this.userRepository.save(user);
    }
  }
}
