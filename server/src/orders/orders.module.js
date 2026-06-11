"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("../entities/order.entity");
const user_entity_1 = require("../entities/user.entity");
const orders_service_1 = require("./orders.service");
const orders_controller_1 = require("./orders.controller");
const products_module_1 = require("../products/products.module");
const credit_service_1 = require("../common/credit.service");
@(0, common_1.Module)({
    imports: [
        typeorm_1.TypeOrmModule.forFeature([order_entity_1.Order, user_entity_1.User]),
        products_module_1.ProductsModule,
    ],
    providers: [orders_service_1.OrdersService, credit_service_1.CreditService],
    controllers: [orders_controller_1.OrdersController],
})
class OrdersModule {
}
exports.OrdersModule = OrdersModule;
//# sourceMappingURL=orders.module.js.map