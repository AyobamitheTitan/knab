import { Body, Controller, Get, Headers, Param, Post, Query, Req } from '@nestjs/common';
import { AccountCreateDTO, AccountTransactDTO } from './dtos/accounts.dto';
import { AccountsService } from './accounts.service';
import { TransactionTypeEnum } from 'src/transactions/enums/transactions.enum';

@Controller('accounts')
export class AccountsController {
    constructor (private accountService: AccountsService){}

    @Post("")
    async create(@Body() accountCreateDTO: AccountCreateDTO, @Headers("authorization") authorization: String){
        return this.accountService.create(accountCreateDTO, authorization)
    }

    @Post("/withdraw")
    async withdraw(@Body() withdrawDTO: AccountTransactDTO, @Headers("authorization") authorization: String){
        return this.accountService.transact(withdrawDTO, TransactionTypeEnum.WITHDRAW,authorization)
    }

    @Post("/deposit")
    async deposit(@Body() depositDTO: AccountTransactDTO, @Headers("authorization") authorization: String){
        return this.accountService.transact(depositDTO, TransactionTypeEnum.DEPOSIT,authorization)
    }

    @Get("/:id/history")
    async history(@Param("id") id: string, @Query("limit") limit = 10){
        return this.accountService.history(id, limit)
    }
}
