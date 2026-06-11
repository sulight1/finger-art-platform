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
exports.SkillExchangeController = void 0;
const common_1 = require("@nestjs/common");
const skill_exchange_service_1 = require("./skill-exchange.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let SkillExchangeController = class SkillExchangeController {
    constructor(exchangeService) {
        this.exchangeService = exchangeService;
    }
    async requestExchange(body, req) {
        return this.exchangeService.requestExchange(req.user, body.userBId, body.description, new Date(body.startTime), new Date(body.endTime));
    }
    async acceptExchange(id, req) {
        return this.exchangeService.acceptExchange(+id, req.user);
    }
    async completeExchange(id) {
        return this.exchangeService.completeExchange(+id);
    }
    async getMyExchanges(req) {
        return this.exchangeService.getMyExchanges(req.user);
    }
};
exports.SkillExchangeController = SkillExchangeController;
__decorate([
    (0, common_1.Post)('request'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SkillExchangeController.prototype, "requestExchange", null);
__decorate([
    (0, common_1.Patch)(':id/accept'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SkillExchangeController.prototype, "acceptExchange", null);
__decorate([
    (0, common_1.Patch)(':id/complete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SkillExchangeController.prototype, "completeExchange", null);
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SkillExchangeController.prototype, "getMyExchanges", null);
exports.SkillExchangeController = SkillExchangeController = __decorate([
    (0, common_1.Controller)('skill-exchange'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [skill_exchange_service_1.SkillExchangeService])
], SkillExchangeController);
//# sourceMappingURL=skill-exchange.controller.js.map