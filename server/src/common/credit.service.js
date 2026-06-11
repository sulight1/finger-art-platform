"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
@(0, common_1.Injectable)()
class CreditService {
    userRepository;
    constructor(
    @(0, typeorm_1.InjectRepository)(user_entity_1.User)
    userRepository) {
        this.userRepository = userRepository;
    }
    async deductCredit(userId, points) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (user) {
            user.creditScore -= points;
            return this.userRepository.save(user);
        }
    }
    async addCredit(userId, points) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (user) {
            user.creditScore += points;
            return this.userRepository.save(user);
        }
    }
}
exports.CreditService = CreditService;
//# sourceMappingURL=credit.service.js.map