import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { CreateProductInput, UpdateProductInput } from './product.dto';

@Resolver(() => Product)
export class ProductResolver {
    constructor(private readonly productService: ProductService) { }

    @Query(() => [Product])
    products() {
        return this.productService.findAll();
    }

    @Query(() => Product, { nullable: true })
    product(@Args('id', { type: () => String }) id: string): Product | undefined {
        return this.productService.findOne(id);
    }

    @Mutation(() => Product)
    createProduct(@Args('input') input: CreateProductInput) {
        return this.productService.create(input);
    }

    @Mutation(() => Product, { nullable: true })
    updateProduct(@Args('input') input: UpdateProductInput): Product | undefined {
        return this.productService.update(input);
    }

    @Mutation(() => Boolean)
    removeProduct(@Args('id', { type: () => String }) id: string) {
        return this.productService.remove(id);
    }
}
