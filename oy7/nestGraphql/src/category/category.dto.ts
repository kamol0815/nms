import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateCategoryInput {
    @Field()
    name: string;
}

@InputType()
export class UpdateCategoryInput {
    @Field(() => ID)
    id: string;

    @Field({ nullable: true })
    name?: string;
}
