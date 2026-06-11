import { SkillExchangeService } from './skill-exchange.service';
export declare class SkillExchangeController {
    private exchangeService;
    constructor(exchangeService: SkillExchangeService);
    requestExchange(body: any, req: any): Promise<import("../entities/skill-exchange.entity").SkillExchange>;
    acceptExchange(id: string, req: any): Promise<import("../entities/skill-exchange.entity").SkillExchange>;
    completeExchange(id: string): Promise<import("../entities/skill-exchange.entity").SkillExchange>;
    getMyExchanges(req: any): Promise<import("../entities/skill-exchange.entity").SkillExchange[]>;
}
//# sourceMappingURL=skill-exchange.controller.d.ts.map