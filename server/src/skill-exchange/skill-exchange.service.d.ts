import { Repository, DataSource } from 'typeorm';
import { SkillExchange } from '../entities/skill-exchange.entity';
import { User } from '../entities/user.entity';
import { Calendar } from '../entities/calendar.entity';
export declare class SkillExchangeService {
    private exchangeRepository;
    private calendarRepository;
    private userRepository;
    private dataSource;
    constructor(exchangeRepository: Repository<SkillExchange>, calendarRepository: Repository<Calendar>, userRepository: Repository<User>, dataSource: DataSource);
    requestExchange(userA: User, userBId: number, description: string, startTime: Date, endTime: Date): Promise<SkillExchange>;
    acceptExchange(id: number, user: User): Promise<SkillExchange>;
    completeExchange(id: number): Promise<SkillExchange>;
    getMyExchanges(user: User): Promise<SkillExchange[]>;
}
//# sourceMappingURL=skill-exchange.service.d.ts.map