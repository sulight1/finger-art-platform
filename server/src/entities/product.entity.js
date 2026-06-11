"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.ProductType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var ProductType;
(function (ProductType) {
    ProductType["READY_MADE"] = "READY_MADE";
    ProductType["CUSTOMIZABLE"] = "CUSTOMIZABLE";
})(ProductType || (exports.ProductType = ProductType = {}));
@(0, typeorm_1.Entity)('products')
class Product {
    @(0, typeorm_1.PrimaryGeneratedColumn)()
    id;
    @(0, typeorm_1.ManyToOne)(() => user_entity_1.User)
    creator;
    @(0, typeorm_1.Column)()
    title;
    @(0, typeorm_1.Column)({ type: 'text' })
    description;
    @(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 })
    price;
    @(0, typeorm_1.Column)({ default: 0 })
    stock;
    @(0, typeorm_1.Column)({ type: 'json', nullable: true })
    tags;
    @(0, typeorm_1.Column)({ type: 'json', nullable: true })
    images;
    @(0, typeorm_1.Column)({
        type: 'enum',
        enum: ProductType,
        default: ProductType.READY_MADE,
    })
    type;
    @(0, typeorm_1.CreateDateColumn)()
    createdAt;
    @(0, typeorm_1.UpdateDateColumn)()
    updatedAt;
}
exports.Product = Product;
//# sourceMappingURL=product.entity.js.map