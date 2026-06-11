import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(username: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            role: any;
        };
    }>;
    register(username: string, pass: string, role: any): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            role: any;
        };
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map