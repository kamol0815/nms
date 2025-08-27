import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Product } from '../product/product.entity';

@ObjectType()
export class Sales {
    @Field(() => ID)
    id: string;

    @Field(() => Product)
    product: Product;

    @Field()
    quantity: number;

    @Field()
    date: Date;
}
