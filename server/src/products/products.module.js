"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("../entities/product.entity");
const products_service_1 = require("./products.service");
const products_controller_1 = require("./products.controller");
@(0, common_1.Module)({
    imports: [typeorm_1.TypeOrmModule.forFeature([product_entity_1.Product])],
    providers: [products_service_1.ProductsService],
    controllers: [products_controller_1.ProductsController],
    exports: [products_service_1.ProductsService],
})
class ProductsModule {
}
exports.ProductsModule = ProductsModule;
//# sourceMappingURL=products.module.js.map