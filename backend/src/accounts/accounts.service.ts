import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account } from './schemas/accounts.schema';
import { Model } from 'mongoose';
import {
  AccountCreateDTO,
  AccountTransactDTO,
  SetAccountPinDTO,
} from './dtos/accounts.dto';
import { randomInt } from 'crypto';
import { verify } from 'argon2';
import { TokenService } from 'src/token/token.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import {
  TransactionStatusEnum,
  TransactionTypeEnum,
} from 'src/transactions/enums/transactions.enum';
import { hash } from 'argon2';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<Account>,
    private tokenService: TokenService,
    private transactionService: TransactionsService,
  ) {}

  private async accountNumberInUse(account_number: string) {
    const account = await this.accountModel.findOne({ account_number }).exec();
    return account;
  }

  async getById(account_id: string) {
    return await this.accountModel.findOne({ _id: account_id }).exec();
  }

  async findById(account_id: string) {
    const account = await this.getById(account_id);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }
  private async generateAccountNumber() {
    while (true) {
      let account_number = '';
      for (let index = 0; index < 9; index++) {
        account_number += randomInt(0, 9);
      }
      if (!(await this.accountNumberInUse(account_number))) {
        return account_number;
      }
    }
  }

  private async setDailyLimit(account_id: string) {
    const account = await this.findById(account_id);
    const latestTransaction =
      await this.transactionService.getLatest(account_id);

    const today = new Date();

    if (latestTransaction) {
      if (
        today.getFullYear() >= latestTransaction.date.getFullYear() &&
        today.getDate() > latestTransaction.date.getDate() &&
        today.getMonth() > latestTransaction.date.getMonth()
      ) {
        account.todays_spendable = account.daily_limit;
      }
    }
    await account.save();
  }

  async getPrimaryAccount(user_id: string){
    return this.accountModel.findOne({user_id:user_id, primary:true}).exec()
  }

  async getUserPrimaryAccount(authorization: string){

    if (!authorization || !authorization.startsWith("Bearer")) {
      throw new BadRequestException('Invalid authorization header.');
    }
    
    const user_id = (await this.tokenService.decode(authorization)).sub

    return await this.getPrimaryAccount(user_id)
  }

  async create(payload: AccountCreateDTO, header: Headers) {
    const authorization = header['authorization'] || header['Authorization'];

    if (!authorization) {
      throw new BadRequestException('Authorization header not added.');
    }
    
    const user_id = (await this.tokenService.decode(authorization)).sub
    return await this.store(payload, user_id, "")
  }

  async store(payload: AccountCreateDTO, user_id: string, account_user_name: string){
    
    const account_number = await this.generateAccountNumber()
    const primaryAccount = await this.getPrimaryAccount(user_id)
    const newAccount = await this.accountModel.create({
      account_type: payload.account_type,
      account_number: account_number,
      user_id: user_id,
      account_user_name: account_user_name,
      primary: primaryAccount ? false: true
    });

    return newAccount;
  }

  async display(account_id: string, header: Headers) {
    const authorization = header['authorization'] || header['Authorization'];

    if (!authorization) {
      throw new BadRequestException('Authorization header not added.');
    }

    const account = await this.findById(account_id);

    const user_id = (await this.tokenService.decode(authorization)).sub;

    if (user_id !== account?.user_id) {
      throw new UnauthorizedException(
        'You are not authorized to view this account',
      );
    }

    return account;
  }

  async displayAllBelongingToUser(
    limit: number,
    skip: number,
    header: Headers,
  ) {
    const authorization = header['authorization'] || header['Authorization'];

    if (!authorization) {
      throw new BadRequestException('Authorization header not added.');
    }
    const user_id = (await this.tokenService.decode(authorization)).sub;

    return this.accountModel.find({ user_id }).limit(limit).skip(skip).exec();
  }

  async transact(
    payload: AccountTransactDTO,
    transactionType: TransactionTypeEnum,
    header: Headers,
  ) {
    const authorization = header['authorization'] || header['Authorization'];

    if (!authorization) {
      throw new BadRequestException('Authorization header not added.');
    }

    const account = await this.findById(payload.account_id);

    const user_id = (await this.tokenService.decode(authorization)).sub;

    if (user_id !== account?.user_id) {
      throw new UnauthorizedException(
        'You are not authorized to transact on this account',
      );
    }

    if (!account.pin) {
      throw new BadRequestException('Account pin has not been set');
    }

    if (!(await verify(account.pin, payload.pin))) {
      throw new BadRequestException('Incorrect pin');
    }

    await this.setDailyLimit(payload.account_id);
    if (transactionType == TransactionTypeEnum.WITHDRAW) {
      if (account.balance < payload.amount) {
        throw new BadRequestException('Insufficient funds');
      }
      if (account.todays_spendable - payload.amount < 0) {
        throw new BadRequestException(
          'Withdrawing this amount will exceed your dailt limit',
        );
      }
      account.balance -= payload.amount;
      account.todays_spendable -= payload.amount;
    } else if (transactionType == TransactionTypeEnum.DEPOSIT) {
      if (account.balance + payload.amount > account.limit) {
        throw new BadRequestException(
          'Depositing this amount will exceed your account limit',
        );
      }
      // if (account.todays_spendable - payload.amount < 0) {
      //   throw new BadRequestException(
      //     'Depositing this amount will exceed your dailt limit',
      //   );
      // }
      account.balance += payload.amount;
      // account.todays_spendable -= payload.amount;
    }
    await account.save();

    return await this.transactionService.create(
      transactionType,
      payload.amount,
      TransactionStatusEnum.SUCCESSFUL,
      payload.description,
      account._id as unknown as string,
    );
  }

  async setPin(payload: SetAccountPinDTO, header: Headers) {
    if (payload.pin !== payload.confirmPin) {
      throw new BadRequestException('Pins do not match');
    }
    const authorization = header['authorization'] || header['Authorization'];

    if (!authorization) {
      throw new BadRequestException('Authorization header not added.');
    }
    const user_id = (await this.tokenService.decode(authorization)).sub;
    const account = await this.findById(payload.account_id);

    if (user_id !== account?.user_id) {
      throw new UnauthorizedException(
        'You are not authorized to access from this account',
      );
    }

    if (account.pin) {
      throw new BadRequestException('Account pin has already been set');
    }
    account.pin = await hash(payload.pin);
    await account.save();

    return account;
  }

  async history(account_id: string, limit: number, skip: number) {
    // const account = await this.findById(account_id)
    // if (!account) {
    //     throw new NotFoundException("Account not found")
    // }
    return this.transactionService.findSome(account_id, limit, skip);
  }
}
