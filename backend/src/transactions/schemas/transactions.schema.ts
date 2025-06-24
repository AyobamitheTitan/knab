import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TransactionStatusEnum, TransactionTypeEnum } from '../enums/transactions.enum';

export type TransactionsDocument = HydratedDocument<Transactions>

@Schema()
export class Transactions {
    @Prop()
    type: TransactionTypeEnum

    @Prop()
    amount: Number

    @Prop()
    status: TransactionStatusEnum

    @Prop()
    description: String

    @Prop()
    account_id: String

    @Prop({default: new Date()})
    date: Date
}

export const TransactionsSchema = SchemaFactory.createForClass(Transactions)