import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { SkillExchange } from './entities/skill-exchange.entity';
import { Calendar } from './entities/calendar.entity';
import { Evaluation } from './entities/evaluation.entity';
import { CustomRequest } from './entities/custom-request.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { SkillExchangeModule } from './skill-exchange/skill-exchange.module';
import { CustomRequestsModule } from './custom-requests/custom-requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'better-sqlite3',
        database: 'database.sqlite',
        entities: [User, Product, Order, SkillExchange, Calendar, Evaluation, CustomRequest],
        synchronize: true, // Only for development!
      }),
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    SkillExchangeModule,
    CustomRequestsModule,
  ],
})
export class AppModule {}
