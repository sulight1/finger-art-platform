import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findOneByUsername(username: string): Promise<User | undefined>;
    findOneById(id: number): Promise<User | undefined>;
    create(userData: Partial<User>): Promise<User>;
}
//# sourceMappingURL=users.service.d.ts.map