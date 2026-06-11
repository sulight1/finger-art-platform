"use strict";
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
@(0, typeorm_1.Entity)('skill_exchanges')
class SkillExchange {
    @(0, typeorm_1.PrimaryGeneratedColumn)()
    id;
    @(0, typeorm_1.ManyToOne)(() => user_entity_1.User)
    userA;
    @(0, typeorm_1.ManyToOne)(() => user_entity_1.User)
    userB;
    @(0, typeorm_1.Column)({
        type: 'enum',
        enum: ExchangeStatus,
        default: ExchangeStatus.REQUESTED,
    })
    status;
    @(0, typeorm_1.Column)({ type: 'text' })
    description;
    @(0, typeorm_1.Column)({ default: 0 })
    zaowuBiCost;
    @(0, typeorm_1.CreateDateColumn)()
    createdAt;
    @(0, typeorm_1.UpdateDateColumn)()
    updatedAt;
}
exports.SkillExchange = SkillExchange;
//# sourceMappingURL=skill-exchange.entity.js.map