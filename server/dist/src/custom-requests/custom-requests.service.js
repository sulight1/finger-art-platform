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
exports.CustomRequestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const custom_request_entity_1 = require("../entities/custom-request.entity");
const user_entity_1 = require("../entities/user.entity");
let CustomRequestsService = class CustomRequestsService {
    customRequestRepository;
    constructor(customRequestRepository) {
        this.customRequestRepository = customRequestRepository;
    }
    async findAll() {
        return this.customRequestRepository.find({
            relations: { buyer: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        return this.customRequestRepository.findOne({
            where: { id },
            relations: { buyer: true },
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
};
exports.CustomRequestsService = CustomRequestsService;
exports.CustomRequestsService = CustomRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(custom_request_entity_1.CustomRequest)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CustomRequestsService);
//# sourceMappingURL=custom-requests.service.js.map