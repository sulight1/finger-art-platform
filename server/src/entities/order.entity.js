"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.OrderStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const product_entity_1 = require("./product.entity");
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING_PAY"] = "PENDING_PAY";
    OrderStatus["PRODUCING"] = "PRODUCING";
    OrderStatus["HALF_FINISHED_CONFIRM"] = "HALF_FINISHED_CONFIRM";
    OrderStatus["PENDING_SHIP"] = "PENDING_SHIP";
    OrderStatus["RECEIVED"] = "RECEIVED";
    OrderStatus["COMPLETED"] = "COMPLETED";
    OrderStatus["CANCELLED"] = "CANCELLED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
@(0, typeorm_1.Entity)('orders')
class Order {
    @(0, typeorm_1.PrimaryGeneratedColumn)()
    id;
    @(0, typeorm_1.ManyToOne)(() => user_entity_1.User)
    buyer;
    @(0, typeorm_1.ManyToOne)(() => product_entity_1.Product)
    product;
    @(0, typeorm_1.Column)({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING_PAY,
    })
    status;
    @(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 })
    amount;
    @(0, typeorm_1.Column)({ type: 'text', nullable: true })
    customRequirements;
    @(0, typeorm_1.Column)({ nullable: true })
    shippingAddress;
    @(0, typeorm_1.CreateDateColumn)()
    createdAt;
    @(0, typeorm_1.UpdateDateColumn)()
    updatedAt;
}
exports.Order = Order;
//# sourceMappingURL=order.entity.js.map