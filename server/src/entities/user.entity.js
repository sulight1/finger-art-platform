"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
var UserRole;
(function (UserRole) {
    UserRole["BUYER"] = "BUYER";
    UserRole["CREATOR"] = "CREATOR";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
@(0, typeorm_1.Entity)('users')
class User {
    @(0, typeorm_1.PrimaryGeneratedColumn)()
    id;
    @(0, typeorm_1.Column)({ unique: true })
    username;
    @(0, typeorm_1.Column)({ select: false })
    password;
    @(0, typeorm_1.Column)({
        type: 'enum',
        enum: UserRole,
        default: UserRole.BUYER,
    })
    role;
    @(0, typeorm_1.Column)({ default: 100 })
    creditScore;
    @(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    zaowuBiBalance;
    @(0, typeorm_1.Column)({ nullable: true })
    avatar;
    @(0, typeorm_1.Column)({ type: 'text', nullable: true })
    bio;
    @(0, typeorm_1.Column)({ default: false })
    realNameVerified;
    @(0, typeorm_1.Column)({ default: false })
    isBanned;
    @(0, typeorm_1.Column)({ nullable: true })
    banUntil;
    @(0, typeorm_1.CreateDateColumn)()
    createdAt;
    @(0, typeorm_1.UpdateDateColumn)()
    updatedAt;
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map