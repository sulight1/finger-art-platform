"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillExchangeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const skill_exchange_entity_1 = require("../entities/skill-exchange.entity");
const user_entity_1 = require("../entities/user.entity");
const calendar_entity_1 = require("../entities/calendar.entity");
let SkillExchangeService = class SkillExchangeService {
    exchangeRepository;
    calendarRepository;
    userRepository;
    dataSource;
    constructor(exchangeRepository, calendarRepository, userRepository, dataSource) {
        this.exchangeRepository = exchangeRepository;
        this.calendarRepository = calendarRepository;
        this.userRepository = userRepository;
        this.dataSource = dataSource;
    }
    async requestExchange(userA, userBId, description, startTime, endTime) {
        const userB = await this.userRepository.findOne({ where: { id: userBId } });
        if (!userB)
            throw new common_1.BadRequestException('Target user not found');
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
            relations: { userA: true, userB: true },
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
            relations: { userA: true, userB: true },
        });
        if (!exchange || exchange.status !== skill_exchange_entity_1.ExchangeStatus.ACCEPTED) {
            throw new common_1.BadRequestException('Exchange cannot be completed');
        }
        return await this.dataSource.transaction(async (manager) => {
            exchange.status = skill_exchange_entity_1.ExchangeStatus.COMPLETED;
            const cost = exchange.zaowuBiCost || 10;
            exchange.userA.zaowuBiBalance -= cost;
            if (exchange.userA.zaowuBiBalance < 0) {
                throw new common_1.BadRequestException('Insufficient ZaoWu Bi balance');
            }
            exchange.userB.zaowuBiBalance += cost;
            await manager.save(exchange.userA);
            await manager.save(exchange.userB);
            return await manager.save(exchange);
        });
    }
    async getMyExchanges(user) {
        return this.exchangeRepository.find({
            where: [{ userA: { id: user.id } }, { userB: { id: user.id } }],
            relations: { userA: true, userB: true },
        });
    }
};
exports.SkillExchangeService = SkillExchangeService;
exports.SkillExchangeService = SkillExchangeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(skill_exchange_entity_1.SkillExchange)),
    __param(1, (0, typeorm_1.InjectRepository)(calendar_entity_1.Calendar)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], SkillExchangeService);
//# sourceMappingURL=skill-exchange.service.js.map