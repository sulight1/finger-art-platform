"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("./entities/user.entity");
const product_entity_1 = require("./entities/product.entity");
const order_entity_1 = require("./entities/order.entity");
const skill_exchange_entity_1 = require("./entities/skill-exchange.entity");
const calendar_entity_1 = require("./entities/calendar.entity");
const evaluation_entity_1 = require("./entities/evaluation.entity");
const custom_request_entity_1 = require("./entities/custom-request.entity");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const products_module_1 = require("./products/products.module");
const orders_module_1 = require("./orders/orders.module");
const skill_exchange_module_1 = require("./skill-exchange/skill-exchange.module");
const custom_requests_module_1 = require("./custom-requests/custom-requests.module");
@(0, common_1.Module)({
    imports: [
        config_1.ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        typeorm_1.TypeOrmModule.forRootAsync({
            imports: [config_1.ConfigModule],
            inject: [config_1.ConfigService],
            useFactory: (configService) => ({
                type: 'mysql',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_DATABASE'),
                entities: [user_entity_1.User, product_entity_1.Product, order_entity_1.Order, skill_exchange_entity_1.SkillExchange, calendar_entity_1.Calendar, evaluation_entity_1.Evaluation, custom_request_entity_1.CustomRequest],
                synchronize: true, // Only for development!
            }),
        }),
        users_module_1.UsersModule,
        auth_module_1.AuthModule,
        products_module_1.ProductsModule,
        orders_module_1.OrdersModule,
        skill_exchange_module_1.SkillExchangeModule,
        custom_requests_module_1.CustomRequestsModule,
    ],
})
class AppModule {
}
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map