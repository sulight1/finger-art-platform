"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomRequestsController = void 0;
const common_1 = require("@nestjs/common");
const custom_requests_service_1 = require("./custom-requests.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
@(0, common_1.Controller)('custom-requests')
class CustomRequestsController {
    customRequestsService;
    constructor(customRequestsService) {
        this.customRequestsService = customRequestsService;
    }
    @(0, common_1.Get)()
    async findAll() {
        return this.customRequestsService.findAll();
    }
    @(0, common_1.Get)(':id')
    async findOne(
    @(0, common_1.Param)('id')
    id) {
        return this.customRequestsService.findOne(+id);
    }
    @(0, common_1.Post)()
    @(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)
    async create(
    @(0, common_1.Body)()
    body, 
    @(0, common_1.Request)()
    req) {
        return this.customRequestsService.create(body, req.user);
    }
    @(0, common_1.Patch)(':id/status')
    @(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)
    async updateStatus(
    @(0, common_1.Param)('id')
    id, 
    @(0, common_1.Body)('status')
    status) {
        return this.customRequestsService.updateStatus(+id, status);
    }
}
exports.CustomRequestsController = CustomRequestsController;
//# sourceMappingURL=custom-requests.controller.js.map