import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SkillExchange, ExchangeStatus } from '../entities/skill-exchange.entity';
import { User } from '../entities/user.entity';
import { Calendar, CalendarType } from '../entities/calendar.entity';

@Injectable()
export class SkillExchangeService {
  constructor(
    @InjectRepository(SkillExchange)
    private exchangeRepository: Repository<SkillExchange>,
    @InjectRepository(Calendar)
    private calendarRepository: Repository<Calendar>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async requestExchange(userA: User, userBId: number, description: string, startTime: Date, endTime: Date, zaowuBiCost?: number): Promise<SkillExchange> {
    const userB = await this.userRepository.findOne({ where: { id: userBId } });
    if (!userB) throw new BadRequestException('Target user not found');

    // Check calendar availability for User B
    const conflict = await this.calendarRepository.createQueryBuilder('calendar')
      .where('calendar.userId = :userId', { userId: userBId })
      .andWhere('calendar.type = :type', { type: CalendarType.BUSY })
      .andWhere('(calendar.startTime < :endTime AND calendar.endTime > :startTime)', { startTime, endTime })
      .getOne();

    if (conflict) {
      throw new BadRequestException('Target user is busy during this time period');
    }

    const exchange = this.exchangeRepository.create({
      userA,
      userB,
      description,
      zaowuBiCost: zaowuBiCost || 10,
      status: ExchangeStatus.REQUESTED,
    });

    return this.exchangeRepository.save(exchange);
  }

  async acceptExchange(id: number, user: User): Promise<SkillExchange> {
    const exchange = await this.exchangeRepository.findOne({
      where: { id },
      relations: { userA: true, userB: true },
    });

    if (!exchange || exchange.userB.id !== user.id) {
      throw new BadRequestException('Exchange not found or not authorized');
    }

    exchange.status = ExchangeStatus.ACCEPTED;
    return this.exchangeRepository.save(exchange);
  }

  async completeExchange(id: number): Promise<SkillExchange> {
    const exchange = await this.exchangeRepository.findOne({
      where: { id },
      relations: { userA: true, userB: true },
    });

    if (!exchange || exchange.status !== ExchangeStatus.ACCEPTED) {
      throw new BadRequestException('Exchange cannot be completed');
    }

    // Atomic transaction for ZaoWu Bi settlement
    return await this.dataSource.transaction(async (manager) => {
      exchange.status = ExchangeStatus.COMPLETED;
      
      const cost = Number(exchange.zaowuBiCost) || 10; // Default cost if not specified

      // Deduct from User A (who requested)
      exchange.userA.zaowuBiBalance = Number(exchange.userA.zaowuBiBalance) - cost;
      if (exchange.userA.zaowuBiBalance < 0) {
        throw new BadRequestException('Insufficient ZaoWu Bi balance');
      }
      
      // Add to User B (who provided service)
      exchange.userB.zaowuBiBalance = Number(exchange.userB.zaowuBiBalance) + cost;

      await manager.save(exchange.userA);
      await manager.save(exchange.userB);
      return await manager.save(exchange);
    });
  }

  async getMyExchanges(user: User): Promise<SkillExchange[]> {
    return this.exchangeRepository.find({
      where: [{ userA: { id: user.id } }, { userB: { id: user.id } }],
      relations: { userA: true, userB: true },
    });
  }
}
