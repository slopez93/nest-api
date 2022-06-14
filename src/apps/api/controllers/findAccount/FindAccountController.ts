import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AccountDto } from 'src/modules/account/application/dtos/AccountDto';
import { FindAccountQuery } from 'src/modules/account/application/query/FindAccountQuery';
import { Account } from 'src/modules/account/domain/entities/Account';

type Params = {
  id: string;
};

@Controller()
export class FindAccountController {
  constructor(
    private queryBus: QueryBus,
    @InjectMapper() private mapper: Mapper,
  ) {}

  @Get(':id')
  async getAccount(@Param() params: Params) {
    const { id } = params;
    const account = await this.queryBus.execute(new FindAccountQuery(id));

    return this.mapper.map(account, Account, AccountDto);
  }
}
