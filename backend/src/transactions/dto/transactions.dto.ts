import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SingleTransactionDTO {
  @Field()
  id: string;
}
