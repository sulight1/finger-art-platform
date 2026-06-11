import { Repository } from 'typeorm';
import { CustomRequest } from '../entities/custom-request.entity';
import { User } from '../entities/user.entity';
export declare class CustomRequestsService {
    private customRequestRepository;
    constructor(customRequestRepository: Repository<CustomRequest>);
    findAll(): Promise<CustomRequest[]>;
    findOne(id: number): Promise<CustomRequest | null>;
    create(data: Partial<CustomRequest>, buyer: User): Promise<CustomRequest>;
    updateStatus(id: number, status: string): Promise<CustomRequest>;
}
//# sourceMappingURL=custom-requests.service.d.ts.map