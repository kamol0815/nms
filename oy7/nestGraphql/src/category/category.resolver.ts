import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { CreateCategoryInput, UpdateCategoryInput } from './category.dto';

@Resolver(() => Category)
export class CategoryResolver {
    constructor(private readonly categoryService: CategoryService) { }

    @Query(() => [Category])
    categories() {
        return this.categoryService.findAll();
    }

    @Query(() => Category, { nullable: true })
    category(@Args('id', { type: () => String }) id: string): Category | undefined {
        return this.categoryService.findOne(id);
    }

    @Mutation(() => Category)
    createCategory(@Args('input') input: CreateCategoryInput) {
        return this.categoryService.create(input);
    }

    @Mutation(() => Category, { nullable: true })
    updateCategory(@Args('input') input: UpdateCategoryInput): Category | undefined {
        return this.categoryService.update(input);
    }

    @Mutation(() => Boolean)
    removeCategory(@Args('id', { type: () => String }) id: string) {
        return this.categoryService.remove(id);
    }
}
