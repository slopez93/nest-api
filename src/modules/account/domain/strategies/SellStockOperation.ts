import { Injectable } from '@nestjs/common';
import { Account } from 'src/modules/account/domain/entities/Account';
import {
  Order,
  OrderOperationTypes,
} from 'src/modules/order/domain/entities/Order';
import { StockOperation, StockOperationResult } from './StockOperation';
import * as Errors from '../errors/errors';

@Injectable()
export class SellStockOperation extends StockOperation {
  public apply(type: string) {
    return type === OrderOperationTypes.SELL;
  }

  public execute(account: Account, order: Order): StockOperationResult {
    const totalOrderPrice = order.getTotalPrice();

    if (
      !account.haveIssuerEnoughShares(order.issuerName.value, order.totalShares)
    ) {
      return { hasError: true, errors: [Errors.INSUFFICIENT_STOCKS] };
    }

    account.subtractIssuerSharePrice(
      order.issuerName.value,
      order.totalShares,
      order.sharePrice,
    );

    account.addCash(totalOrderPrice);

    return { hasError: false, errors: [] };
  }
}
