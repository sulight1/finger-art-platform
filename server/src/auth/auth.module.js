"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const users_module_1 = require("../users/users.module");
const jwt_strategy_1 = require("./jwt.strategy");
@(0, common_1.Module)({
    imports: [
        users_module_1.UsersModule,
        passport_1.PassportModule,
        jwt_1.JwtModule.registerAsync({
            imports: [config_1.ConfigModule],
            inject: [config_1.ConfigService],
            useFactory: (configService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: '1d' },
            }),
        }),
    ],
    providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
    controllers: [auth_controller_1.AuthController],
    exports: [auth_service_1.AuthService],
})
class AuthModule {
}
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map