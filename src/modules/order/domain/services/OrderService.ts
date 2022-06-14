import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  MARKET_CLOSED,
  DUPLICATED_OPERATION,
} from 'src/modules/account/domain/errors/errors';
import { FindDuplicatedOrdersQuery } from '../../application/query/FindDuplicatedOrdersQuery';
import { Order } from '../entities/Order';

@Injectable()
export class OrderService {
  constructor(private queryBus: QueryBus) {}

  public async duplicatedOrder(order: Order): Promise<string[]> {
    const duplicatedOrders = await this.queryBus.execute(
      new FindDuplicatedOrdersQuery(order),
    );

    if (duplicatedOrders.length > 0) {
      return [DUPLICATED_OPERATION];
    }

    return [];
  }

  public isMarketClosed(order: Order): string[] {
    if (!order.isOnAllowedDate()) {
      return [MARKET_CLOSED];
    }

    return [];
  }
}
