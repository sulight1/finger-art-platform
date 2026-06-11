"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const user_entity_1 = require("../entities/user.entity");
@(0, common_1.Controller)('auth')
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    @(0, common_1.Post)('login')
    async login(
    @(0, common_1.Body)()
    body) {
        const user = await this.authService.validateUser(body.username, body.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }
    @(0, common_1.Post)('register')
    async register(
    @(0, common_1.Body)()
    body) {
        return this.authService.register(body.username, body.password, body.role || user_entity_1.UserRole.BUYER);
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map