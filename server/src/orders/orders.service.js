"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../entities/order.entity");
const user_entity_1 = require("../entities/user.entity");
const product_entity_1 = require("../entities/product.entity");
const credit_service_1 = require("../common/credit.service");
@(0, common_1.Injectable)()
class OrdersService {
    ordersRepository;
    creditService;
    constructor(
    @(0, typeorm_1.InjectRepository)(order_entity_1.Order)
    ordersRepository, creditService) {
        this.ordersRepository = ordersRepository;
        this.creditService = creditService;
    }
    async create(orderData, buyer, product) {
        const order = this.ordersRepository.create({
            ...orderData,
            buyer,
            product,
            status: order_entity_1.OrderStatus.PENDING_PAY,
            amount: product.price, // Base price, could be adjusted for custom orders
        });
        return this.ordersRepository.save(order);
    }
    async findAll(user) {
        return this.ordersRepository.find({
            where: user.role === 'CREATOR' ? { product: { creator: { id: user.id } } } : { buyer: { id: user.id } },
            relations: ['buyer', 'product', 'product.creator'],
        });
    }
    async findOne(id) {
        return this.ordersRepository.findOne({
            where: { id },
            relations: ['buyer', 'product', 'product.creator'],
        });
    }
    async updateStatus(id, status, user) {
        const order = await this.findOne(id);
        if (!order)
            throw new common_1.BadRequestException('Order not found');
        // Basic state machine logic
        const allowedTransitions = {
            [order_entity_1.OrderStatus.PENDING_PAY]: [order_entity_1.OrderStatus.PRODUCING, order_entity_1.OrderStatus.CANCELLED],
            [order_entity_1.OrderStatus.PRODUCING]: [order_entity_1.OrderStatus.HALF_FINISHED_CONFIRM, order_entity_1.OrderStatus.CANCELLED],
            [order_entity_1.OrderStatus.HALF_FINISHED_CONFIRM]: [order_entity_1.OrderStatus.PENDING_SHIP, order_entity_1.OrderStatus.CANCELLED],
            [order_entity_1.OrderStatus.PENDING_SHIP]: [order_entity_1.OrderStatus.RECEIVED],
            [order_entity_1.OrderStatus.RECEIVED]: [order_entity_1.OrderStatus.COMPLETED],
            [order_entity_1.OrderStatus.COMPLETED]: [],
            [order_entity_1.OrderStatus.CANCELLED]: [],
        };
        if (!allowedTransitions[order.status].includes(status)) {
            throw new common_1.BadRequestException(`Cannot transition from ${order.status} to ${status}`);
        }
        // Role-based restrictions (e.g., only creator can mark as PRODUCING)
        if (status === order_entity_1.OrderStatus.PRODUCING && user.id !== order.product.creator.id) {
            throw new common_1.BadRequestException('Only the creator can start production');
        }
        // Special logic for cancellation during production
        if (status === order_entity_1.OrderStatus.CANCELLED && order.status === order_entity_1.OrderStatus.PRODUCING) {
            if (user.id === order.product.creator.id) {
                // Penalty for creator cancelling during production
                await this.creditService.deductCredit(user.id, 10);
                // Ban for 7 days
                const banUntil = new Date();
                banUntil.setDate(banUntil.getDate() + 7);
                // This would ideally be handled in a dedicated user management service
                // For now, let's assume creditService can handle basic penalty logic
            }
        }
        order.status = status;
        return this.ordersRepository.save(order);
    }
}
exports.OrdersService = OrdersService;
//# sourceMappingURL=orders.service.js.map