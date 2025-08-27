import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
    @Field()
    name: string;

    @Field()
    price: number;

    @Field(() => ID)
    categoryId: string;
}

@InputType()
export class UpdateProductInput {
    @Field(() => ID)
    id: string;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    price?: number;

    @Field(() => ID, { nullable: true })
    categoryId?: string;
}
