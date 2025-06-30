import { Args, Resolver, Query as GraphQLQuery } from '@nestjs/graphql';
import { TransactionsService } from './transactions.service';
import { SingleTransactionDTO } from './dto/transactions.dto';
import { Transactions } from './schemas/transactions.schema';

@Resolver()
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @GraphQLQuery(() => [Transactions])
  async singleTransaction(
    @Args('singleTransactionDTO') singleTransactionDTO: SingleTransactionDTO,
  ) {
    return await this.transactionsService.findById(singleTransactionDTO.id);
  }
}
