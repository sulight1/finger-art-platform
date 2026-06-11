import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { SkillExchangeService } from './skill-exchange.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('skill-exchange')
@UseGuards(JwtAuthGuard)
export class SkillExchangeController {
  constructor(private exchangeService: SkillExchangeService) {}

  @Post('request')
  async requestExchange(@Body() body: any, @Request() req: any) {
    return this.exchangeService.requestExchange(
      req.user,
      body.userBId,
      body.description,
      new Date(body.startTime),
      new Date(body.endTime),
      body.zaowuBiCost
    );
  }

  @Patch(':id/accept')
  async acceptExchange(@Param('id') id: string, @Request() req: any) {
    return this.exchangeService.acceptExchange(+id, req.user);
  }

  @Patch(':id/complete')
  async completeExchange(@Param('id') id: string) {
    return this.exchangeService.completeExchange(+id);
  }

  @Get('my')
  async getMyExchanges(@Request() req: any) {
    return this.exchangeService.getMyExchanges(req.user);
  }
}
