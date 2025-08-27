import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Sales } from './sales.entity';
import { SalesService } from './sales.service';
import { CreateSalesInput, UpdateSalesInput } from './sales.dto';

@Resolver(() => Sales)
export class SalesResolver {
    constructor(private readonly salesService: SalesService) { }

    @Query(() => [Sales])
    sales() {
        return this.salesService.findAll();
    }

    @Query(() => Sales, { nullable: true })
    sale(@Args('id', { type: () => String }) id: string): Sales | undefined {
        return this.salesService.findOne(id);
    }

    @Mutation(() => Sales)
    createSale(@Args('input') input: CreateSalesInput) {
        return this.salesService.create(input);
    }

    @Mutation(() => Sales, { nullable: true })
    updateSale(@Args('input') input: UpdateSalesInput): Sales | undefined {
        return this.salesService.update(input);
    }

    @Mutation(() => Boolean)
    removeSale(@Args('id', { type: () => String }) id: string) {
        return this.salesService.remove(id);
    }
}
