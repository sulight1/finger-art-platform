"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomRequestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const custom_request_entity_1 = require("../entities/custom-request.entity");
const user_entity_1 = require("../entities/user.entity");
@(0, common_1.Injectable)()
class CustomRequestsService {
    customRequestRepository;
    constructor(
    @(0, typeorm_1.InjectRepository)(custom_request_entity_1.CustomRequest)
    customRequestRepository) {
        this.customRequestRepository = customRequestRepository;
    }
    async findAll() {
        return this.customRequestRepository.find({
            relations: ['buyer'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        return this.customRequestRepository.findOne({
            where: { id },
            relations: ['buyer'],
        });
    }
    async create(data, buyer) {
        const request = this.customRequestRepository.create({
            ...data,
            buyer,
            status: 'OPEN',
        });
        return this.customRequestRepository.save(request);
    }
    async updateStatus(id, status) {
        await this.customRequestRepository.update(id, { status });
        return this.findOne(id);
    }
}
exports.CustomRequestsService = CustomRequestsService;
//# sourceMappingURL=custom-requests.service.js.map