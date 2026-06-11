import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class CreditService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    deductCredit(userId: number, points: number): Promise<User>;
    addCredit(userId: number, points: number): Promise<User>;
}
