import { AggregateRoot } from '@nestjs/cqrs';
import { isWithinInterval } from 'date-fns';
import { AccountId } from 'src/modules/account/domain/valueObjects/AccountId';
import { IssuerName } from 'src/shared/domain/IssuerName';
import { OrderCreatedDomainEvent } from '../events/OrderCreatedDomainEvent';
import { OrderId } from '../valueObjects/OrderId';

type Params = {
  accountId: string;
  issuerName: string;
  operation: string;
  totalShares: number;
  sharePrice: number;
  createdAt: Date;
};

export enum OrderOperationTypes {
  BUY = 'BUY',
  SELL = 'SELL',
}

export class Order extends AggregateRoot {
  public id: OrderId;
  public accountId: AccountId;
  public operation: OrderOperationTypes;
  public issuerName: IssuerName;
  public totalShares: number;
  public sharePrice: number;
  public createdAt: Date;

  constructor(
    id: OrderId,
    accountId: AccountId,
    operation: OrderOperationTypes,
    issuerName: IssuerName,
    totalShares: number,
    sharePrice: number,
    createdAt: Date,
  ) {
    super();
    this.id = id;
    this.accountId = accountId;
    this.operation = operation;
    this.issuerName = issuerName;
    this.totalShares = totalShares;
    this.sharePrice = sharePrice;
    this.createdAt = createdAt;
  }

  static create({
    accountId,
    operation,
    issuerName,
    totalShares,
    sharePrice,
    createdAt,
  }: Params) {
    const order = new Order(
      OrderId.create(),
      AccountId.create(accountId),
      OrderOperationTypes[operation],
      IssuerName.create(issuerName),
      totalShares,
      sharePrice,
      createdAt,
    );
    order.apply(new OrderCreatedDomainEvent(order));

    return order;
  }

  public getTotalPrice(): number {
    return this.totalShares * this.sharePrice;
  }

  public isOnAllowedDate(): boolean {
    const currentDate = new Date();
    const minDate = new Date().setHours(6, 0, 0, 0);
    const maxDate = new Date().setHours(15, 0, 0, 0);

    return isWithinInterval(currentDate, {
      start: new Date(minDate),
      end: new Date(maxDate),
    });
  }
}
