import { Injectable, NotFoundException } from '@nestjs/common';
import {
  TransactionStatusEnum,
  TransactionTypeEnum,
} from './enums/transactions.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Transactions } from './schemas/transactions.schema';
import { Model } from 'mongoose';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transactions.name)
    private transactionModel: Model<Transactions>,
  ) {}

  async create(
    type: TransactionTypeEnum,
    amount: number,
    status: TransactionStatusEnum,
    description: string | undefined,
    account_id: string,
  ) {
    return await this.transactionModel.create({
      type,
      amount,
      status,
      description,
      account_id,
      date: new Date()
    });
  }

  async findById(id: string) {
    const transaction = await this.transactionModel.findOne({ _id: id }).exec();
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  async findSome(account_id: string, limit: number, skip: number) {
    return await this.transactionModel
      .find({ account_id })
      .limit(limit)
      .skip(skip)
      .exec();
  }

  async getLatest(account_id: string) {
    return await this.transactionModel.findOne({ account_id }).exec();
  }
}
