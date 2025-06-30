import { IsNotEmpty, IsNumber, MaxLength, MinLength } from 'class-validator';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  AccountTypeEnum,
} from '../enums/accounts.enum';
import { TransactionTypeEnum } from 'src/transactions/enums/transactions.enum';

@InputType()
export class AccountCreateDTO {
  @Field(() => AccountTypeEnum)
  @IsNotEmpty()
  account_type: AccountTypeEnum;
}

@InputType()
export class AccountDisplayDTO {
  @Field()
  @IsNotEmpty()
  account_id: string;
}

@InputType()
export class AccountTransactDTO {
  @Field(() => Number)
  @IsNumber()
  amount: number;

  @Field(() => String)
  @IsNotEmpty()
  account_id: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  transaction_type: TransactionTypeEnum

  @Field(() => String)
  @IsNotEmpty()
  pin: string;
}

@InputType()
export class AccountHistoryDTO {
  @Field(() => String)
  id: string;

  @Field({ nullable: true })
  limit: number = 10;

  @Field({ nullable: true })
  skip: number = 0;
}

@InputType()
export class SetAccountPinDTO {
  @Field(() => String)
  @MinLength(4)
  @MaxLength(4)
  pin: string;

  @Field(() => String)
  @MinLength(4)
  @MaxLength(4)
  confirmPin: string;

  @Field(() => String)
  @IsNotEmpty()
  account_id: string;
}

@InputType()
export class GetUserPrimaryAccountDTO{
  @Field()
  token: string
}
