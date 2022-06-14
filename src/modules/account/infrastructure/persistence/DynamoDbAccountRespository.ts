import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { DynamoDbClient } from 'src/shared/infrastructure/services/DynamoDbClient';
import { AccountDto } from '../../application/dtos/AccountDto';
import { Account } from '../../domain/entities/Account';
import { AccountRepository } from '../../domain/repositories/AccountRepository';

@Injectable()
export class DynamoDbAccountRepository implements AccountRepository {
  private readonly tableName: string;

  constructor(
    private dynamoDb: DynamoDbClient,
    @InjectMapper() private mapper: Mapper,
  ) {
    this.tableName = process.env.ACCOUNT_TABLE;
  }

  public async findById(id: string): Promise<Account> {
    const statement = `SELECT id, cash, issuers  FROM "${this.tableName}" WHERE pk = 'ACCOUNT#${id}'`;

    const dbItem = await this.dynamoDb.executeStatement({
      Statement: statement,
    });

    if (!dbItem || dbItem.length === 0) {
      return;
    }

    return this.mapper.map(dbItem[0], AccountDto, Account);
  }

  public async save(account: Account): Promise<void> {
    const accountId = account.id.toString();
    const issuers = account.issuers.map((issuer) => ({
      issuer_name: issuer.name.value,
      total_shares: issuer.totalShares,
      share_price: issuer.sharePrice,
    }));

    const dynamoDbConfig = {
      Item: {
        pk: `ACCOUNT#${accountId}`,
        sk: `ACCOUNT#${accountId}`,
        id: accountId,
        cash: account.cash.value,
        issuers: issuers,
      },
      TableName: this.tableName,
    };

    await this.dynamoDb.client.put(dynamoDbConfig);
  }
}
