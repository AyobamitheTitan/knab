import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";
import { AccountTypeEnum } from "../enums/accounts.enum";

export class AccountCreateDTO{
    @IsNotEmpty()
    account_type: AccountTypeEnum
}

export class AccountTransactDTO{
    @IsNumber()
    amount: number
    @IsNotEmpty()
    account_id: string
    description: string
}
