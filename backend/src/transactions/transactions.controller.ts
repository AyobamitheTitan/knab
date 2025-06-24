import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { SetTransactionPinDTO } from './dto/transactions.dto';

@Controller('transactions')
export class TransactionsController {
    constructor(private transactionsService: TransactionsService){}

    @Post("/pin")
    async setTransactionPin(@Body() payload: SetTransactionPinDTO, @Headers("authorization") authorization: string){
        return await this.transactionsService.setTransactionPin(authorization, payload)
    }

    @Get("/:id")
    async transactionHistory(@Param("id") id: String){
        return await this.transactionsService.findById(id)
    }
}
