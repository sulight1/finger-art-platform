"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomRequestsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const custom_request_entity_1 = require("../entities/custom-request.entity");
const custom_requests_service_1 = require("./custom-requests.service");
const custom_requests_controller_1 = require("./custom-requests.controller");
@(0, common_1.Module)({
    imports: [typeorm_1.TypeOrmModule.forFeature([custom_request_entity_1.CustomRequest])],
    providers: [custom_requests_service_1.CustomRequestsService],
    controllers: [custom_requests_controller_1.CustomRequestsController],
    exports: [custom_requests_service_1.CustomRequestsService],
})
class CustomRequestsModule {
}
exports.CustomRequestsModule = CustomRequestsModule;
//# sourceMappingURL=custom-requests.module.js.map