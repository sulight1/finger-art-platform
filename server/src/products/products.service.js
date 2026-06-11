"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
const user_entity_1 = require("../entities/user.entity");
@(0, common_1.Injectable)()
class ProductsService {
    productsRepository;
    constructor(
    @(0, typeorm_1.InjectRepository)(product_entity_1.Product)
    productsRepository) {
        this.productsRepository = productsRepository;
    }
    async findAll(query) {
        const qb = this.productsRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.creator', 'creator');
        if (query?.tags) {
            // Simple tag filtering
            qb.andWhere('product.tags LIKE :tag', { tag: `%${query.tags}%` });
        }
        if (query?.type) {
            qb.andWhere('product.type = :type', { type: query.type });
        }
        return qb.getMany();
    }
    async findOne(id) {
        return this.productsRepository.findOne({
            where: { id },
            relations: ['creator'],
        });
    }
    async create(productData, creator) {
        const product = this.productsRepository.create({
            ...productData,
            creator,
        });
        return this.productsRepository.save(product);
    }
    async update(id, productData) {
        await this.productsRepository.update(id, productData);
        return this.findOne(id);
    }
    async delete(id) {
        await this.productsRepository.delete(id);
    }
}
exports.ProductsService = ProductsService;
//# sourceMappingURL=products.service.js.map