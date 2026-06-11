import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ProductsModule } from '../products/products.module';
import { CreditService } from '../common/credit.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User]),
    ProductsModule,
  ],
  providers: [OrdersService, CreditService],
  controllers: [OrdersController],
})
export class OrdersModule {}
