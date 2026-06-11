import { ProductsService } from './products.service';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    findAll(query: any): Promise<import("../entities/product.entity").Product[]>;
    findOne(id: string): Promise<import("../entities/product.entity").Product>;
    create(body: any, req: any): Promise<import("../entities/product.entity").Product>;
    update(id: string, body: any): Promise<import("../entities/product.entity").Product>;
    delete(id: string): Promise<void>;
}
