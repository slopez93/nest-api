import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { sub } from 'date-fns';
import { DynamoDbClient } from 'src/shared/infrastructure/services/DynamoDbClient';
import { OrderDto } from '../../application/dtos/OrderDto';
import { Order } from '../../domain/entities/Order';
import { OrderRepository } from '../../domain/repositories/OrderRepository';

@Injectable()
export class DynamoDbOrderRepository implements OrderRepository {
  private readonly tableName: string;

  constructor(
    private dynamoDb: DynamoDbClient,
    @InjectMapper() private mapper: Mapper,
  ) {
    this.tableName = process.env.ACCOUNT_TABLE
  }

  public async findById(id: string): Promise<Order> {
    const statement = `SELECT * FROM "${this.tableName}" WHERE pk = 'ORDER#${id}'`;

    const dbItem = await this.dynamoDb.executeStatement({
      Statement: statement,
    });

    if (!dbItem || dbItem.length === 0) {
      return;
    }

    return this.mapper.map(dbItem[0], OrderDto, Order);
  }

  public async findDuplicated(order: Order): Promise<Order[]> {
    const currentDate = new Date();
    const maxAllowedDate = sub(currentDate, {
      minutes: 5,
    });

    const statement = `SELECT * FROM "${
      this.tableName
    }" WHERE gs1pk = 'ORDER#TOTAL#${order.getTotalPrice()}' AND createdAt BETWEEN '${maxAllowedDate.toISOString()}' AND '${currentDate.toISOString()}'`;

    const dbItem = await this.dynamoDb.executeStatement({
      Statement: statement,
    });

    if (!dbItem || dbItem.length === 0) {
      return [];
    }

    return this.mapper.mapArray(dbItem, OrderDto, Order);
  }

  public async save(order: Order): Promise<void> {
    const orderId = order.id.toString();
    const accountId = order.accountId.toString();

    const dynamoDbConfig = {
      Item: {
        pk: `ACCOUNT#${accountId}`,
        sk: `ORDER#${orderId}`,
        gs1pk: `ORDER#TOTAL#${order.getTotalPrice()}`,
        gs1sk: `ORDER#TOTAL#${order.getTotalPrice()}`,
        id: orderId,
        accountId: accountId,
        operation: order.operation,
        issuer_name: order.issuerName.value,
        total_shares: order.totalShares,
        share_price: order.sharePrice,
        createdAt: order.createdAt.toISOString(),
      },
      TableName: this.tableName,
    };

    await this.dynamoDb.client.put(dynamoDbConfig);
  }
}
