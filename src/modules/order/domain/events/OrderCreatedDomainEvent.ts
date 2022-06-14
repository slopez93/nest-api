import { DomainEvent } from 'src/shared/domain/DomainEvent';
import { Order } from '../entities/Order';

type OrderCreatedDomainEventDto = {
  readonly eventName: string;
  readonly orderId: string;
  readonly accountId: string;
  readonly issuerName: string;
  readonly totalShares: number;
  readonly sharePrice: number;
};

export class OrderCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'order.created';

  public readonly order: Order;

  constructor(order: Order) {
    super(OrderCreatedDomainEvent.EVENT_NAME, order.id.value);
    this.order = order;
  }

  toDTO(): OrderCreatedDomainEventDto {
    const { eventName, order } = this;

    return {
      eventName,
      orderId: order.id.toString(),
      accountId: order.accountId.toString(),
      issuerName: order.issuerName.value,
      totalShares: order.totalShares,
      sharePrice: order.sharePrice,
    };
  }
}
