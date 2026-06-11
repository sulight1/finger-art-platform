import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(query?: any): Promise<Product[]> {
    const qb = this.productsRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.creator', 'creator');

    if (query?.tags) {
      // Simple tag filtering
      qb.andWhere('product.tags LIKE :tag', { tag: `%${query.tags}%` });
    }

    if (query?.type) {
      qb.andWhere('product.type = :type', { type: query.type });
    }

    return qb.getMany();
  }

  async findOne(id: number): Promise<Product | null> {
    return this.productsRepository.findOne({
      where: { id },
      relations: { creator: true },
    });
  }

  async create(productData: Partial<Product>, creator: User): Promise<Product> {
    const product = this.productsRepository.create({
      ...productData,
      creator,
    });
    return this.productsRepository.save(product);
  }

  async update(id: number, productData: Partial<Product>): Promise<Product> {
    await this.productsRepository.update(id, productData);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
