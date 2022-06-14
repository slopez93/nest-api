import { Account } from 'src/modules/account/domain/entities/Account';
import { Order } from 'src/modules/order/domain/entities/Order';

export const STOCK_OPERATION = 'STOCK_OPERATION';

export type StockOperationResult = {
  hasError: boolean;
  errors: string[];
};

export abstract class StockOperation {
  public abstract apply(type: string): boolean;

  public abstract execute(account: Account, order: Order): StockOperationResult;
}
