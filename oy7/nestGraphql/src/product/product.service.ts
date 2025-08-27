import { Injectable } from '@nestjs/common';
import { Product } from './product.entity';
import { CreateProductInput, UpdateProductInput } from './product.dto';

@Injectable()
export class ProductService {
    private products: Product[] = [];

    create(input: CreateProductInput): Product {
        const product = {
            id: (Math.random() * 100000).toFixed(0),
            name: input.name,
            price: input.price,
            category: { id: input.categoryId, name: '' },
        };
        this.products.push(product);
        return product;
    }

    findAll(): Product[] {
        return this.products;
    }

    findOne(id: string): Product | undefined {
        return this.products.find(p => p.id === id);
    }

    update(input: UpdateProductInput): Product | undefined {
        const product = this.findOne(input.id);
        if (!product) return undefined;
        if (input.name) product.name = input.name;
        if (input.price) product.price = input.price;
        if (input.categoryId) product.category = { id: input.categoryId, name: '' };
        return product;
    }

    remove(id: string): boolean {
        const idx = this.products.findIndex(p => p.id === id);
        if (idx === -1) return false;
        this.products.splice(idx, 1);
        return true;
    }
}
