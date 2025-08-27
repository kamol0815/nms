import { Injectable } from '@nestjs/common';
import { Category } from './category.entity';
import { CreateCategoryInput, UpdateCategoryInput } from './category.dto';

@Injectable()
export class CategoryService {
    private categories: Category[] = [];

    create(input: CreateCategoryInput): Category {
        const category = {
            id: (Math.random() * 100000).toFixed(0),
            name: input.name,
        };
        this.categories.push(category);
        return category;
    }

    findAll(): Category[] {
        return this.categories;
    }

    findOne(id: string): Category | undefined {
        return this.categories.find(c => c.id === id);
    }

    update(input: UpdateCategoryInput): Category | undefined {
        const category = this.findOne(input.id);
        if (!category) return undefined;
        if (input.name) category.name = input.name;
        return category;
    }

    remove(id: string): boolean {
        const idx = this.categories.findIndex(c => c.id === id);
        if (idx === -1) return false;
        this.categories.splice(idx, 1);
        return true;
    }
}
