import { Injectable } from '@nestjs/common';
import { Sales } from './sales.entity';
import { CreateSalesInput, UpdateSalesInput } from './sales.dto';

@Injectable()
export class SalesService {
    private sales: Sales[] = [];

    create(input: CreateSalesInput): Sales {
        const sale = {
            id: (Math.random() * 100000).toFixed(0),
            product: { id: input.productId, name: '', price: 0, category: { id: '', name: '' } },
            quantity: input.quantity,
            date: input.date,
        };
        this.sales.push(sale);
        return sale;
    }

    findAll(): Sales[] {
        return this.sales;
    }

    findOne(id: string): Sales | undefined {
        return this.sales.find(s => s.id === id);
    }

    update(input: UpdateSalesInput): Sales | undefined {
        const sale = this.findOne(input.id);
        if (!sale) return undefined;
        if (input.productId) sale.product = { id: input.productId, name: '', price: 0, category: { id: '', name: '' } };
        if (input.quantity) sale.quantity = input.quantity;
        if (input.date) sale.date = input.date;
        return sale;
    }

    remove(id: string): boolean {
        const idx = this.sales.findIndex(s => s.id === id);
        if (idx === -1) return false;
        this.sales.splice(idx, 1);
        return true;
    }
}
