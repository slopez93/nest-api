import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateAccountCommand } from 'src/modules/account/application/command/CreateAccountCommand';
import { AccountDto } from 'src/modules/account/application/dtos/AccountDto';
import { Account } from 'src/modules/account/domain/entities/Account';
import { CreateAccountRequest } from './CreateAccountRequest';

@Controller()
export class CreateAccountController {
  constructor(
    private commandBus: CommandBus,
    @InjectMapper() private mapper: Mapper,
  ) {}

  @Post()
  async createAccount(@Body() body: CreateAccountRequest) {
    const { cash } = body;

    const account = await this.commandBus.execute(
      new CreateAccountCommand(cash),
    );

    return this.mapper.map(account, Account, AccountDto);
  }
}
