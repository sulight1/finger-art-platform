"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const products_service_1 = require("../products/products.service");
const order_entity_1 = require("../entities/order.entity");
@(0, common_1.Controller)('orders')
@(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)
class OrdersController {
    ordersService;
    productsService;
    constructor(ordersService, productsService) {
        this.ordersService = ordersService;
        this.productsService = productsService;
    }
    @(0, common_1.Post)()
    async create(
    @(0, common_1.Body)()
    body, 
    @(0, common_1.Request)()
    req) {
        const product = await this.productsService.findOne(body.productId);
        return this.ordersService.create(body, req.user, product);
    }
    @(0, common_1.Get)()
    async findAll(
    @(0, common_1.Request)()
    req) {
        return this.ordersService.findAll(req.user);
    }
    @(0, common_1.Get)(':id')
    async findOne(
    @(0, common_1.Param)('id')
    id) {
        return this.ordersService.findOne(+id);
    }
    @(0, common_1.Patch)(':id/status')
    async updateStatus(
    @(0, common_1.Param)('id')
    id, 
    @(0, common_1.Body)('status')
    status, 
    @(0, common_1.Request)()
    req) {
        return this.ordersService.updateStatus(+id, status, req.user);
    }
}
exports.OrdersController = OrdersController;
//# sourceMappingURL=orders.controller.js.map