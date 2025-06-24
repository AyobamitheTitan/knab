import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TokenService } from 'src/token/token.service';
import { UserService } from 'src/user/user.service';
import { SetTransactionPinDTO } from './dto/transactions.dto';
import { TransactionStatusEnum, TransactionTypeEnum } from './enums/transactions.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Transactions } from './schemas/transactions.schema';
import { Model } from 'mongoose';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectModel(Transactions.name) private transactionModel: Model<Transactions>,
        private tokenService: TokenService, 
        private userService: UserService
    ) { }

    async setTransactionPin(authHeader: String, payload: SetTransactionPinDTO) {
        if (payload.pin !== payload.confirmPin) {
            throw new BadRequestException("Pins do not match")
        }

        const user_id = (await this.tokenService.decode(authHeader)).sub
        
        await this.userService.setTransactionPin(user_id, payload.pin)
        return { data: true }
    }

    async create(
        type: TransactionTypeEnum,
        amount: number,
        status: TransactionStatusEnum,
        description: string,
        account_id: string
    ){
        return await this.transactionModel.create({type, amount, status,description,account_id})
    }


    async findById(id: String){
        const transaction = await this.transactionModel.findOne({_id:id}).exec()
        if (!transaction) {
            throw new NotFoundException("Transaction not found")
        }
        return transaction
    }


    async findSome(account_id: String, limit = 10){
        return await this.transactionModel.find({account_id}).limit(limit).exec()
    }
}
