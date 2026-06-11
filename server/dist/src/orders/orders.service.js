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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../entities/order.entity");
const user_entity_1 = require("../entities/user.entity");
const product_entity_1 = require("../entities/product.entity");
const credit_service_1 = require("../common/credit.service");
let OrdersService = class OrdersService {
    ordersRepository;
    creditService;
    constructor(ordersRepository, creditService) {
        this.ordersRepository = ordersRepository;
        this.creditService = creditService;
    }
    async create(orderData, buyer, product) {
        const order = this.ordersRepository.create({
            ...orderData,
            buyer,
            product,
            status: order_entity_1.OrderStatus.PENDING_PAY,
            amount: product.price,
        });
        return this.ordersRepository.save(order);
    }
    async findAll(user) {
        return this.ordersRepository.find({
            where: user.role === 'CREATOR' ? { product: { creator: { id: user.id } } } : { buyer: { id: user.id } },
            relations: { buyer: true, product: { creator: true } },
        });
    }
    async findOne(id) {
        return this.ordersRepository.findOne({
            where: { id },
            relations: { buyer: true, product: { creator: true } },
        });
    }
    async updateStatus(id, status, user) {
        const order = await this.findOne(id);
        if (!order)
            throw new common_1.BadRequestException('Order not found');
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
        if (status === order_entity_1.OrderStatus.PRODUCING && user.id !== order.product.creator.id) {
            throw new common_1.BadRequestException('Only the creator can start production');
        }
        if (status === order_entity_1.OrderStatus.CANCELLED && order.status === order_entity_1.OrderStatus.PRODUCING) {
            if (user.id === order.product.creator.id) {
                await this.creditService.deductCredit(user.id, 10);
                const banUntil = new Date();
                banUntil.setDate(banUntil.getDate() + 7);
            }
        }
        order.status = status;
        return this.ordersRepository.save(order);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        credit_service_1.CreditService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map