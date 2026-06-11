import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductsService } from '../products/products.service';
import { OrderStatus } from '../entities/order.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private productsService: ProductsService
  ) {}

  @Post()
  async create(@Body() body: any, @Request() req: any) {
    const product = await this.productsService.findOne(body.productId);
    return this.ordersService.create(body, req.user, product);
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.ordersService.findAll(req.user);
  }

  @Get('artisan/:id')
  async findByArtisan(@Param('id') id: string) {
    return this.ordersService.findByArtisan(+id);
  }

  @Get('buyer/:id')
  async findByBuyer(@Param('id') id: string) {
    return this.ordersService.findByBuyer(+id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus, @Request() req: any) {
    return this.ordersService.updateStatus(+id, status, req.user);
  }
}
