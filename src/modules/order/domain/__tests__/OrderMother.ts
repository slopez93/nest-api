import { OrderIdMother } from './OrderIdMother';
import { Order, OrderOperationTypes } from '../entities/Order';
import { IssuerName } from 'src/shared/domain/IssuerName';
import { WordMother } from 'test/shared/WordMother';
import { IntegerMother } from 'test/shared/IntegerMother';
import { AccountIdMother } from 'src/modules/account/domain/__tests__/AccountIdMother';

export class OrderMother {
  static create({
    id = OrderIdMother.random(),
    accountId = AccountIdMother.random(),
    operation = OrderOperationTypes.BUY,
    issuerName = IssuerName.create(WordMother.random(4)),
    totalShares = IntegerMother.random(),
    sharePrice = IntegerMother.random(),
    createdAt = new Date(),
  }: Partial<Order>) {
    return new Order(
      id,
      accountId,
      operation,
      issuerName,
      totalShares,
      sharePrice,
      createdAt,
    );
  }
}
