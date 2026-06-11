"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_entity_1 = require("../entities/user.entity");
@(0, common_1.Controller)('products')
class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    @(0, common_1.Get)()
    async findAll(
    @(0, common_1.Query)()
    query) {
        return this.productsService.findAll(query);
    }
    @(0, common_1.Get)(':id')
    async findOne(
    @(0, common_1.Param)('id')
    id) {
        return this.productsService.findOne(+id);
    }
    @(0, common_1.Post)()
    @(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard)
    @(0, roles_decorator_1.Roles)(user_entity_1.UserRole.CREATOR, user_entity_1.UserRole.ADMIN)
    async create(
    @(0, common_1.Body)()
    body, 
    @(0, common_1.Request)()
    req) {
        return this.productsService.create(body, req.user);
    }
    @(0, common_1.Put)(':id')
    @(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard)
    @(0, roles_decorator_1.Roles)(user_entity_1.UserRole.CREATOR, user_entity_1.UserRole.ADMIN)
    async update(
    @(0, common_1.Param)('id')
    id, 
    @(0, common_1.Body)()
    body) {
        return this.productsService.update(+id, body);
    }
    @(0, common_1.Delete)(':id')
    @(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard)
    @(0, roles_decorator_1.Roles)(user_entity_1.UserRole.CREATOR, user_entity_1.UserRole.ADMIN)
    async delete(
    @(0, common_1.Param)('id')
    id) {
        return this.productsService.delete(+id);
    }
}
exports.ProductsController = ProductsController;
//# sourceMappingURL=products.controller.js.map