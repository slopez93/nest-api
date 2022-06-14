import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderCreatedDomainEvent } from '../../domain/events/OrderCreatedDomainEvent';
import {
  OrderRepository,
  ORDER_REPOSITORY,
} from '../../domain/repositories/OrderRepository';

@EventsHandler(OrderCreatedDomainEvent)
export class OrderCreatedEventHandler
  implements IEventHandler<OrderCreatedDomainEvent>
{
  constructor(@Inject(ORDER_REPOSITORY) private repository: OrderRepository) {}

  public async handle({ order }: OrderCreatedDomainEvent) {
    this.repository.save(order);
  }
}
