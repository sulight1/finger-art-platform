"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Evaluation = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const order_entity_1 = require("./order.entity");
@(0, typeorm_1.Entity)('evaluations')
class Evaluation {
    @(0, typeorm_1.PrimaryGeneratedColumn)()
    id;
    @(0, typeorm_1.ManyToOne)(() => order_entity_1.Order)
    order;
    @(0, typeorm_1.ManyToOne)(() => user_entity_1.User)
    rater;
    @(0, typeorm_1.ManyToOne)(() => user_entity_1.User)
    ratee;
    @(0, typeorm_1.Column)({ type: 'int' })
    score; // 1-5
    @(0, typeorm_1.Column)({ type: 'text', nullable: true })
    comment;
    @(0, typeorm_1.Column)({ type: 'json', nullable: true })
    images;
    @(0, typeorm_1.CreateDateColumn)()
    createdAt;
}
exports.Evaluation = Evaluation;
//# sourceMappingURL=evaluation.entity.js.map