import { Injectable } from '@nestjs/common';
import { Account } from 'src/modules/account/domain/entities/Account';
import {
  Order,
  OrderOperationTypes,
} from 'src/modules/order/domain/entities/Order';
import { StockOperation, StockOperationResult } from './StockOperation';
import * as Errors from '../errors/errors';

@Injectable()
export class BuyStockOperation extends StockOperation {
  public apply(type: string): boolean {
    return type === OrderOperationTypes.BUY;
  }

  public execute(account: Account, order: Order): StockOperationResult {
    const totalOrderPrice = order.getTotalPrice();

    if (!account.haveCashEnough(totalOrderPrice)) {
      return { hasError: true, errors: [Errors.INSUFFICIENT_BALANCE] };
    }

    account.addIssuerSharePrice(
      order.issuerName.value,
      order.totalShares,
      order.sharePrice,
    );

    account.subtractCash(totalOrderPrice);

    return { hasError: false, errors: [] };
  }
}
