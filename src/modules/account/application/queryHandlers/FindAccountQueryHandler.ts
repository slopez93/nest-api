import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AccountNotFound } from 'src/shared/domain/exceptions/AccountNotFound';
import { Account } from '../../domain/entities/Account';
import {
  AccountRepository,
  ACCOUNT_REPOSITORY,
} from '../../domain/repositories/AccountRepository';
import { FindAccountQuery } from '../query/FindAccountQuery';

@QueryHandler(FindAccountQuery)
export class FindAccountQueryHandler
  implements IQueryHandler<FindAccountQuery>
{
  constructor(
    @Inject(ACCOUNT_REPOSITORY) private repository: AccountRepository,
  ) {}

  async execute({ id }: FindAccountQuery): Promise<Account> {
    const account = await this.repository.findById(id);

    if (!account) {
      throw new AccountNotFound(id);
    }

    return account;
  }
}
