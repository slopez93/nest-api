import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Order } from '../../domain/entities/Order';
import {
  OrderRepository,
  ORDER_REPOSITORY,
} from '../../domain/repositories/OrderRepository';
import { FindDuplicatedOrdersQuery } from '../query/FindDuplicatedOrdersQuery';

@QueryHandler(FindDuplicatedOrdersQuery)
export class FindDuplicatedOrdersQueryHandler
  implements IQueryHandler<FindDuplicatedOrdersQuery>
{
  constructor(@Inject(ORDER_REPOSITORY) private repository: OrderRepository) {}

  public async execute({ order }: FindDuplicatedOrdersQuery): Promise<Order[]> {
    return await this.repository.findDuplicated(order);
  }
}
