import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomRequest } from '../entities/custom-request.entity';
import { CustomRequestsService } from './custom-requests.service';
import { CustomRequestsController } from './custom-requests.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomRequest])],
  providers: [CustomRequestsService],
  controllers: [CustomRequestsController],
  exports: [CustomRequestsService],
})
export class CustomRequestsModule {}
