"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillExchangeController = void 0;
const common_1 = require("@nestjs/common");
const skill_exchange_service_1 = require("./skill-exchange.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
@(0, common_1.Controller)('skill-exchange')
@(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)
class SkillExchangeController {
    exchangeService;
    constructor(exchangeService) {
        this.exchangeService = exchangeService;
    }
    @(0, common_1.Post)('request')
    async requestExchange(
    @(0, common_1.Body)()
    body, 
    @(0, common_1.Request)()
    req) {
        return this.exchangeService.requestExchange(req.user, body.userBId, body.description, new Date(body.startTime), new Date(body.endTime));
    }
    @(0, common_1.Patch)(':id/accept')
    async acceptExchange(
    @(0, common_1.Param)('id')
    id, 
    @(0, common_1.Request)()
    req) {
        return this.exchangeService.acceptExchange(+id, req.user);
    }
    @(0, common_1.Patch)(':id/complete')
    async completeExchange(
    @(0, common_1.Param)('id')
    id) {
        return this.exchangeService.completeExchange(+id);
    }
    @(0, common_1.Get)('my')
    async getMyExchanges(
    @(0, common_1.Request)()
    req) {
        return this.exchangeService.getMyExchanges(req.user);
    }
}
exports.SkillExchangeController = SkillExchangeController;
//# sourceMappingURL=skill-exchange.controller.js.map