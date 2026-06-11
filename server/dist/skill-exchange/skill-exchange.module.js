"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillExchangeModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const skill_exchange_entity_1 = require("../entities/skill-exchange.entity");
const calendar_entity_1 = require("../entities/calendar.entity");
const user_entity_1 = require("../entities/user.entity");
const skill_exchange_service_1 = require("./skill-exchange.service");
const skill_exchange_controller_1 = require("./skill-exchange.controller");
let SkillExchangeModule = class SkillExchangeModule {
};
exports.SkillExchangeModule = SkillExchangeModule;
exports.SkillExchangeModule = SkillExchangeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([skill_exchange_entity_1.SkillExchange, calendar_entity_1.Calendar, user_entity_1.User]),
        ],
        providers: [skill_exchange_service_1.SkillExchangeService],
        controllers: [skill_exchange_controller_1.SkillExchangeController],
    })
], SkillExchangeModule);
//# sourceMappingURL=skill-exchange.module.js.map