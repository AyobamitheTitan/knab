import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';
import { AccountStatusEnum, AccountTierEnum, AccountTypeEnum } from '../enums/accounts.enum';

export type AccountDocument = HydratedDocument<Account>

@Schema()
export class Account {
    @Prop({ default: 0 })
    balance: number

    @Prop()
    account_type: AccountTypeEnum

    @Prop({ unique: true })
    account_number: String

    @Prop({ default: AccountStatusEnum.APPROVED })
    status: AccountStatusEnum

    @Prop({ default: 500000 })
    limit: number

    @Prop({ default: 100000 })
    daily_limit: number

    @Prop({ default: AccountTierEnum.OBSIDIAN })
    tier: AccountTierEnum

    @Prop()
    user_id: String
}

export const AccountSchema = SchemaFactory.createForClass(Account)