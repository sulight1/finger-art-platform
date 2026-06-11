"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
@(0, common_1.Injectable)()
class UsersService {
    usersRepository;
    constructor(
    @(0, typeorm_1.InjectRepository)(user_entity_1.User)
    usersRepository) {
        this.usersRepository = usersRepository;
    }
    async findOneByUsername(username) {
        return this.usersRepository.findOne({ where: { username }, select: ['id', 'username', 'password', 'role'] });
    }
    async findOneById(id) {
        return this.usersRepository.findOne({ where: { id } });
    }
    async create(userData) {
        const user = this.usersRepository.create(userData);
        return this.usersRepository.save(user);
    }
}
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map