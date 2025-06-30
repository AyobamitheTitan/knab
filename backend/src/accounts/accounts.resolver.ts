import {
  Args,
  Context,
  Mutation,
  Resolver,
  Query as GraphQLQuery,
} from '@nestjs/graphql';
import { AccountsService } from './accounts.service';
import { Account } from './schemas/accounts.schema';
import {
  AccountCreateDTO,
  AccountDisplayDTO,
  AccountHistoryDTO,
  AccountTransactDTO,
  GetUserPrimaryAccountDTO,
  SetAccountPinDTO,
} from './dtos/accounts.dto';
import { Transactions } from 'src/transactions/schemas/transactions.schema';
import { PaginationArgs } from 'src/common/dto/paginate.dto';

@Resolver()
export class AccountsResolver {
  constructor(private readonly accountService: AccountsService) {}

  @Mutation(() => Account)
  async create(
    @Args('accountCreateDTO') accountCreateDTO: AccountCreateDTO,
    @Context() context: RequestContext,
  ) {
    return this.accountService.create(accountCreateDTO, context.req.headers);
  }

  @Mutation(() => Account)
  async setPin(
    @Args('setPinDTO') setPinDTO: SetAccountPinDTO,
    @Context() context: RequestContext,
  ) {
    return this.accountService.setPin(setPinDTO, context.req.headers);
  }

  @Mutation(() => Transactions)
  async transact(
    @Args('transactDTO') transactDTO: AccountTransactDTO,
    @Context() context: RequestContext,
  ) {
    return this.accountService.transact(
      transactDTO,
      transactDTO.transaction_type,
      context.req.headers,
    );
  }

  @GraphQLQuery(() => Account)
  async findById(
    @Args('accountDisplayDTO') accountDisplayDTO: AccountDisplayDTO,
    @Context() context: RequestContext,
  ) {
    return this.accountService.display(
      accountDisplayDTO.account_id,
      context.req.headers,
    );
  }

  @GraphQLQuery(() => [Account])
  async findAllBelongingToUser(
    @Args('paginateDTO') { limit, offset }: PaginationArgs,
    @Context() context: RequestContext,
  ) {
    return this.accountService.displayAllBelongingToUser(
      limit,
      offset,
      context.req.headers,
    );
  }

  @GraphQLQuery(() => [Transactions])
  async history(@Args('historyDTO') historyDTO: AccountHistoryDTO) {
    return this.accountService.history(
      historyDTO.id,
      historyDTO.limit,
      historyDTO.skip,
    );
  }

  @GraphQLQuery(type => Account, {nullable:true})
  async primaryAccount(@Args("getPrimaryAccountDTO") getPrimaryAccountDTO: GetUserPrimaryAccountDTO,){
    return await this.accountService.getUserPrimaryAccount(getPrimaryAccountDTO.token)
  }
}
