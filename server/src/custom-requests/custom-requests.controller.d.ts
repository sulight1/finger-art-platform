import { CustomRequestsService } from './custom-requests.service';
export declare class CustomRequestsController {
    private customRequestsService;
    constructor(customRequestsService: CustomRequestsService);
    findAll(): Promise<import("../entities/custom-request.entity").CustomRequest[]>;
    findOne(id: string): Promise<import("../entities/custom-request.entity").CustomRequest>;
    create(body: any, req: any): Promise<import("../entities/custom-request.entity").CustomRequest>;
    updateStatus(id: string, status: string): Promise<import("../entities/custom-request.entity").CustomRequest>;
}
//# sourceMappingURL=custom-requests.controller.d.ts.map