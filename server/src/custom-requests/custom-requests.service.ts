import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomRequest } from '../entities/custom-request.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class CustomRequestsService {
  constructor(
    @InjectRepository(CustomRequest)
    private customRequestRepository: Repository<CustomRequest>,
  ) {}

  async findAll(): Promise<CustomRequest[]> {
    return this.customRequestRepository.find({
      relations: { buyer: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<CustomRequest | null> {
    return this.customRequestRepository.findOne({
      where: { id },
      relations: { buyer: true },
    });
  }

  async create(data: Partial<CustomRequest>, buyer: User): Promise<CustomRequest> {
    const request = this.customRequestRepository.create({
      ...data,
      buyer,
      status: 'OPEN',
    });
    return this.customRequestRepository.save(request);
  }

  async updateStatus(id: number, status: string): Promise<CustomRequest> {
    await this.customRequestRepository.update(id, { status });
    return this.findOne(id);
  }
}
