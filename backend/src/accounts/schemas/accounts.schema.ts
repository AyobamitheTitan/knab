import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import {
  AccountStatusEnum,
  AccountTierEnum,
  AccountTypeEnum,
} from '../enums/accounts.enum';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Transactions, TransactionsSchema } from 'src/transactions/schemas/transactions.schema';

export type AccountDocument = HydratedDocument<Account>;

registerEnumType(AccountTypeEnum, {
  name: 'AccountTypeEnum',
  description: 'Savings or current.',
});

registerEnumType(AccountStatusEnum, {
  name: 'AccountStatusEnum',
  description: 'Acceptance status of the account. Defaults to approved.',
});

registerEnumType(AccountTierEnum, {
  name: 'AccountTierEnum',
  description:
    'Outlines the various tiers of the account, from the lowest to the highest.',
});

@ObjectType()
@Schema()
export class Account {
  @Field(type => String, { nullable: true })
  _id: MongooseSchema.Types.ObjectId;

  @Field(type => Number, { nullable: true })
  @Prop({ default: 0 })
  balance: number;

  @Field(type => AccountTypeEnum, { nullable: true })
  @Prop()
  account_type: AccountTypeEnum;

  @Field(type => String, { nullable: true })
  @Prop({ unique: true })
  account_number: string;

  @Field(type => AccountStatusEnum, { nullable: true })
  @Prop({ default: AccountStatusEnum.APPROVED })
  status: AccountStatusEnum;

  @Field(type => Number, { nullable: true })
  @Prop({ default: 500000 })
  limit: number;

  @Field(type => Number, { nullable: true })
  @Prop({ default: 100000 })
  daily_limit: number;

  @Field(type => Number, { nullable: true })
  @Prop({ default: 100000 })
  todays_spendable: number;

  @Field(type => AccountTierEnum, { nullable: true })
  @Prop({ default: AccountTierEnum.OBSIDIAN })
  tier: AccountTierEnum;

  @Prop()
  pin: string;

  @Field(type => Boolean, { nullable: true })
  @Prop({ default: false })
  primary: Boolean

  @Field(type => String, { nullable: true })
  @Prop()
  user_id: string;

  @Field(type => String,{nullable:true} )
  @Prop()
  account_user_name: string
}

export const AccountSchema = SchemaFactory.createForClass(Account);
