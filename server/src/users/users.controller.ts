import { Controller, Get, Post, Body, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findOneById(req.user.id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  @Post('add-coins')
  async addCoins(@Request() req: any, @Body() body: { amount: number }) {
    if (!body.amount || body.amount <= 0) {
      throw new BadRequestException('Invalid amount');
    }
    return this.usersService.addZaoWuBi(req.user.id, body.amount);
  }
}
