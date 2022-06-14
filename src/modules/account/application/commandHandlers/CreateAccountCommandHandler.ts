import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Account } from '../../domain/entities/Account';
import {
  AccountRepository,
  ACCOUNT_REPOSITORY,
} from '../../domain/repositories/AccountRepository';
import { CreateAccountCommand } from '../command/CreateAccountCommand';

@CommandHandler(CreateAccountCommand)
export class CreateAccountCommandHandler
  implements ICommandHandler<CreateAccountCommand>
{
  constructor(
    @Inject(ACCOUNT_REPOSITORY) private repository: AccountRepository,
  ) {}

  async execute(command: CreateAccountCommand): Promise<Account> {
    const { cash } = command;

    const account = Account.create({ cash });

    await this.repository.save(account);

    return account;
  }
}
