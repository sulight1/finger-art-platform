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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillExchange = exports.ExchangeStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var ExchangeStatus;
(function (ExchangeStatus) {
    ExchangeStatus["REQUESTED"] = "REQUESTED";
    ExchangeStatus["ACCEPTED"] = "ACCEPTED";
    ExchangeStatus["COMPLETED"] = "COMPLETED";
    ExchangeStatus["CANCELLED"] = "CANCELLED";
})(ExchangeStatus || (exports.ExchangeStatus = ExchangeStatus = {}));
let SkillExchange = class SkillExchange {
};
exports.SkillExchange = SkillExchange;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SkillExchange.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], SkillExchange.prototype, "userA", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], SkillExchange.prototype, "userB", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        default: ExchangeStatus.REQUESTED,
    }),
    __metadata("design:type", String)
], SkillExchange.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], SkillExchange.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], SkillExchange.prototype, "zaowuBiCost", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SkillExchange.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SkillExchange.prototype, "updatedAt", void 0);
exports.SkillExchange = SkillExchange = __decorate([
    (0, typeorm_1.Entity)('skill_exchanges')
], SkillExchange);
//# sourceMappingURL=skill-exchange.entity.js.map