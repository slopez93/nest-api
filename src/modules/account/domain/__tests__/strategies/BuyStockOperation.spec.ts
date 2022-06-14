import { OrderOperationTypes } from 'src/modules/order/domain/entities/Order';
import { OrderMother } from 'src/modules/order/domain/__tests__/OrderMother';
import { INSUFFICIENT_BALANCE } from '../../errors/errors';
import { BuyStockOperation } from '../../strategies/BuyStockOperation';
import { AccountCashMother } from '../AccountCashMother';
import { AccountMother } from '../AccountMother';

describe('Test BuyStockOperation strategy', () => {
  test('when call to apply method and order type is BUY then return true', () => {
    const buyStockOperation = new BuyStockOperation();

    expect(buyStockOperation.apply(OrderOperationTypes.BUY)).toEqual(true);
  });

  test('when call to apply method and order type is SELL then return false', () => {
    const buyStockOperation = new BuyStockOperation();

    expect(buyStockOperation.apply(OrderOperationTypes.SELL)).toEqual(false);
  });

  test('when account have enough money then return empty errors', () => {
    const account = AccountMother.create({
      cash: AccountCashMother.create(100),
    });
    const order = OrderMother.create({
      totalShares: 1,
      sharePrice: 5,
    });

    const buyStockOperation = new BuyStockOperation();

    const result = buyStockOperation.execute(account, order);

    const expectedResult = { hasError: false, errors: [] };

    expect(result).toEqual(expectedResult);
  });

  test('when account not have enough money then return INSUFFICIENT_BALANCE error', () => {
    const account = AccountMother.create({
      cash: AccountCashMother.create(10),
    });
    const order = OrderMother.create({
      totalShares: 1,
      sharePrice: 20,
    });

    const buyStockOperation = new BuyStockOperation();

    const result = buyStockOperation.execute(account, order);

    const expectedResult = { hasError: true, errors: [INSUFFICIENT_BALANCE] };

    expect(result).toEqual(expectedResult);
  });
});
