"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillExchangeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const skill_exchange_entity_1 = require("../entities/skill-exchange.entity");
const user_entity_1 = require("../entities/user.entity");
const calendar_entity_1 = require("../entities/calendar.entity");
@(0, common_1.Injectable)()
class SkillExchangeService {
    exchangeRepository;
    calendarRepository;
    userRepository;
    dataSource;
    constructor(
    @(0, typeorm_1.InjectRepository)(skill_exchange_entity_1.SkillExchange)
    exchangeRepository, 
    @(0, typeorm_1.InjectRepository)(calendar_entity_1.Calendar)
    calendarRepository, 
    @(0, typeorm_1.InjectRepository)(user_entity_1.User)
    userRepository, dataSource) {
        this.exchangeRepository = exchangeRepository;
        this.calendarRepository = calendarRepository;
        this.userRepository = userRepository;
        this.dataSource = dataSource;
    }
    async requestExchange(userA, userBId, description, startTime, endTime) {
        const userB = await this.userRepository.findOne({ where: { id: userBId } });
        if (!userB)
            throw new common_1.BadRequestException('Target user not found');
        // Check calendar availability for User B
        const conflict = await this.calendarRepository.createQueryBuilder('calendar')
            .where('calendar.userId = :userId', { userId: userBId })
            .andWhere('calendar.type = :type', { type: calendar_entity_1.CalendarType.BUSY })
            .andWhere('(calendar.startTime < :endTime AND calendar.endTime > :startTime)', { startTime, endTime })
            .getOne();
        if (conflict) {
            throw new common_1.BadRequestException('Target user is busy during this time period');
        }
        const exchange = this.exchangeRepository.create({
            userA,
            userB,
            description,
            status: skill_exchange_entity_1.ExchangeStatus.REQUESTED,
        });
        return this.exchangeRepository.save(exchange);
    }
    async acceptExchange(id, user) {
        const exchange = await this.exchangeRepository.findOne({
            where: { id },
            relations: ['userA', 'userB'],
        });
        if (!exchange || exchange.userB.id !== user.id) {
            throw new common_1.BadRequestException('Exchange not found or not authorized');
        }
        exchange.status = skill_exchange_entity_1.ExchangeStatus.ACCEPTED;
        return this.exchangeRepository.save(exchange);
    }
    async completeExchange(id) {
        const exchange = await this.exchangeRepository.findOne({
            where: { id },
            relations: ['userA', 'userB'],
        });
        if (!exchange || exchange.status !== skill_exchange_entity_1.ExchangeStatus.ACCEPTED) {
            throw new common_1.BadRequestException('Exchange cannot be completed');
        }
        // Atomic transaction for ZaoWu Bi settlement
        return await this.dataSource.transaction(async (manager) => {
            exchange.status = skill_exchange_entity_1.ExchangeStatus.COMPLETED;
            const cost = exchange.zaowuBiCost || 10; // Default cost if not specified
            // Deduct from User A (who requested)
            exchange.userA.zaowuBiBalance -= cost;
            if (exchange.userA.zaowuBiBalance < 0) {
                throw new common_1.BadRequestException('Insufficient ZaoWu Bi balance');
            }
            // Add to User B (who provided service)
            exchange.userB.zaowuBiBalance += cost;
            await manager.save(exchange.userA);
            await manager.save(exchange.userB);
            return await manager.save(exchange);
        });
    }
    async getMyExchanges(user) {
        return this.exchangeRepository.find({
            where: [{ userA: { id: user.id } }, { userB: { id: user.id } }],
            relations: ['userA', 'userB'],
        });
    }
}
exports.SkillExchangeService = SkillExchangeService;
//# sourceMappingURL=skill-exchange.service.js.map