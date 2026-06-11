"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomRequestsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const custom_request_entity_1 = require("../entities/custom-request.entity");
const custom_requests_service_1 = require("./custom-requests.service");
const custom_requests_controller_1 = require("./custom-requests.controller");
let CustomRequestsModule = class CustomRequestsModule {
};
exports.CustomRequestsModule = CustomRequestsModule;
exports.CustomRequestsModule = CustomRequestsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([custom_request_entity_1.CustomRequest])],
        providers: [custom_requests_service_1.CustomRequestsService],
        controllers: [custom_requests_controller_1.CustomRequestsController],
        exports: [custom_requests_service_1.CustomRequestsService],
    })
], CustomRequestsModule);
//# sourceMappingURL=custom-requests.module.js.map