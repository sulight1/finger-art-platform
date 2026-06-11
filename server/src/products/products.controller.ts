import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, Query, BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  async create(@Body() body: any, @Request() req: any) {
    if (req.user.isBanned && new Date() < new Date(req.user.banUntil)) {
      throw new BadRequestException('You are currently banned from creating products');
    }
    return this.productsService.create(body, req.user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() body: any) {
    return this.productsService.update(+id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  async delete(@Param('id') id: string) {
    return this.productsService.delete(+id);
  }
}
