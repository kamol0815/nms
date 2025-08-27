import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Category } from '../category/category.entity';

@ObjectType()
export class Product {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    price: number;

    @Field(() => Category)
    category: Category;
}
