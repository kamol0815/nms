import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateSalesInput {
    @Field(() => ID)
    productId: string;

    @Field()
    quantity: number;

    @Field()
    date: Date;
}

@InputType()
export class UpdateSalesInput {
    @Field(() => ID)
    id: string;

    @Field(() => ID, { nullable: true })
    productId?: string;

    @Field({ nullable: true })
    quantity?: number;

    @Field({ nullable: true })
    date?: Date;
}
