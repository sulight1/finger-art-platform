import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { CustomRequestsService } from './custom-requests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('custom-requests')
export class CustomRequestsController {
  constructor(private customRequestsService: CustomRequestsService) {}

  @Get()
  async findAll() {
    return this.customRequestsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.customRequestsService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: any, @Request() req: any) {
    return this.customRequestsService.create(body, req.user);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.customRequestsService.updateStatus(+id, status);
  }
}
