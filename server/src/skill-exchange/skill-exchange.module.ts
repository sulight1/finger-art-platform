import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillExchange } from '../entities/skill-exchange.entity';
import { Calendar } from '../entities/calendar.entity';
import { User } from '../entities/user.entity';
import { SkillExchangeService } from './skill-exchange.service';
import { SkillExchangeController } from './skill-exchange.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([SkillExchange, Calendar, User]),
  ],
  providers: [SkillExchangeService],
  controllers: [SkillExchangeController],
})
export class SkillExchangeModule {}
