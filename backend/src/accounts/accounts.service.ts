import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account } from './schemas/accounts.schema';
import { Model } from 'mongoose';
import { AccountCreateDTO, AccountTransactDTO } from './dtos/accounts.dto';
import { randomInt } from 'crypto';
import { TokenService } from 'src/token/token.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { TransactionStatusEnum, TransactionTypeEnum } from 'src/transactions/enums/transactions.enum';


@Injectable()
export class AccountsService {
    constructor(
        @InjectModel(Account.name) private accountModel: Model<Account>,
        private tokenService: TokenService,
        private transactionService: TransactionsService) { }

    private async accountNumberInUse(account_number: String) {
        const account = await this.accountModel.findOne({ account_number }).exec()
        return account
    }

    async findById(account_id: string) {
        return await this.accountModel.findOne({ _id: account_id }).exec()
    }

    private async generateAccountNumber() {
        while (true) {
            let account_number = ""
            for (let index = 0; index < 9; index++) {
                account_number += randomInt(0, 9)
            }
            if (!(await this.accountNumberInUse(account_number))) {
                return account_number
            }
        }
    }

    async create(payload: AccountCreateDTO, authHeader: String) {
        let account_number = await this.generateAccountNumber()
        const newAccount = await this.accountModel.create({
            account_type: payload.account_type,
            account_number: account_number,
            user_id: (await this.tokenService.decode(authHeader)).sub
        })
        return { data: newAccount }
    }

    async transact(payload: AccountTransactDTO, transactionType: TransactionTypeEnum, authHeader: String) {
        let account = await this.findById(payload.account_id)
        const user_id = (await this.tokenService.decode(authHeader)).sub
        if (!account) {
            throw new NotFoundException("Account not found")
        }

        if (user_id !== account?.user_id) {
            throw new UnauthorizedException("You are not authorized to withdraw from this account")
        }

        if (transactionType == TransactionTypeEnum.WITHDRAW) {
            if (account.balance < payload.amount) {
                throw new BadRequestException("Insufficient funds")
            }
            account.balance -= payload.amount

        } else if (transactionType == TransactionTypeEnum.DEPOSIT) {
            if (account.balance + payload.amount > account.limit) {
                throw new BadRequestException("Depositing this amount will exceed your account limit")
            }
            account.balance += payload.amount
        }
        account.save()

        return { data: await this.transactionService.create(transactionType, payload.amount, TransactionStatusEnum.SUCCESSFUL, payload.description, account._id as unknown as string) }
    }


    async history(account_id: string, limit: number){
        // const account = await this.findById(account_id)
        // if (!account) {
        //     throw new NotFoundException("Account not found")
        // }
        return {data:this.transactionService.findSome(account_id, limit)}
    }
}
