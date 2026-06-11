"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomRequest = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
@(0, typeorm_1.Entity)('custom_requests')
class CustomRequest {
    @(0, typeorm_1.PrimaryGeneratedColumn)()
    id;
    @(0, typeorm_1.ManyToOne)(() => user_entity_1.User)
    buyer;
    @(0, typeorm_1.Column)()
    title;
    @(0, typeorm_1.Column)({ type: 'text' })
    description;
    @(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 })
    budgetMin;
    @(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 })
    budgetMax;
    @(0, typeorm_1.Column)({ nullable: true })
    expectedMaterial;
    @(0, typeorm_1.Column)({ type: 'json', nullable: true })
    referenceImages;
    @(0, typeorm_1.Column)()
    deadline;
    @(0, typeorm_1.Column)({ default: 'OPEN' }) // OPEN, CLOSED, COMPLETED
    status;
    @(0, typeorm_1.CreateDateColumn)()
    createdAt;
    @(0, typeorm_1.UpdateDateColumn)()
    updatedAt;
}
exports.CustomRequest = CustomRequest;
//# sourceMappingURL=custom-request.entity.js.map