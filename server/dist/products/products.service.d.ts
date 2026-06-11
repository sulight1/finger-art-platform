import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
export declare class ProductsService {
    private productsRepository;
    constructor(productsRepository: Repository<Product>);
    findAll(query?: any): Promise<Product[]>;
    findOne(id: number): Promise<Product | null>;
    create(productData: Partial<Product>, creator: User): Promise<Product>;
    update(id: number, productData: Partial<Product>): Promise<Product>;
    delete(id: number): Promise<void>;
}
