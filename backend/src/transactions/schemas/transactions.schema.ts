import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

import { HydratedDocument } from 'mongoose';
import {
  TransactionStatusEnum,
  TransactionTypeEnum,
} from '../enums/transactions.enum';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export type TransactionsDocument = HydratedDocument<Transactions>;

registerEnumType(TransactionTypeEnum, {
  name: 'TransactionTypeEnum',
  description: 'Type of transaction, either deposit or withdraw',
});

registerEnumType(TransactionStatusEnum, {
  name: 'TransactionStatusEnum',
  description:
    'Status of the transaction, can be successful, failed, reversed or pending',
});

@ObjectType()
@Schema()
export class Transactions {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
  @Field(() => TransactionTypeEnum)
  @Prop()
  type: TransactionTypeEnum;

  @Field(() => Number)
  @Prop()
  amount: number;

  @Field(() => TransactionStatusEnum)
  @Prop()
  status: TransactionStatusEnum;

  @Field(() => String)
  @Prop()
  description: string;

  @Field(() => String)
  @Prop()
  account_id: string;

  @Field(() => Date)
  @Prop({ default: new Date() })
  date: Date;
}

export const TransactionsSchema = SchemaFactory.createForClass(Transactions);
