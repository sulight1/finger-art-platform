"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillExchangeModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const skill_exchange_entity_1 = require("../entities/skill-exchange.entity");
const calendar_entity_1 = require("../entities/calendar.entity");
const user_entity_1 = require("../entities/user.entity");
const skill_exchange_service_1 = require("./skill-exchange.service");
const skill_exchange_controller_1 = require("./skill-exchange.controller");
@(0, common_1.Module)({
    imports: [
        typeorm_1.TypeOrmModule.forFeature([skill_exchange_entity_1.SkillExchange, calendar_entity_1.Calendar, user_entity_1.User]),
    ],
    providers: [skill_exchange_service_1.SkillExchangeService],
    controllers: [skill_exchange_controller_1.SkillExchangeController],
})
class SkillExchangeModule {
}
exports.SkillExchangeModule = SkillExchangeModule;
//# sourceMappingURL=skill-exchange.module.js.map