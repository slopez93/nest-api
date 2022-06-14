import { OrderOperationTypes } from 'src/modules/order/domain/entities/Order';
import { OrderMother } from 'src/modules/order/domain/__tests__/OrderMother';
import { IssuerName } from 'src/shared/domain/IssuerName';
import { INSUFFICIENT_STOCKS } from '../../errors/errors';
import { SellStockOperation } from '../../strategies/SellStockOperation';
import { AccountCashMother } from '../AccountCashMother';
import { AccountMother } from '../AccountMother';
import { IssuerMother } from '../IssuerMother';

describe('Test SellStockOperation strategy', () => {
  test('when call to apply method and order type is BUY then return true', () => {
    const buyStockOperation = new SellStockOperation();

    expect(buyStockOperation.apply(OrderOperationTypes.SELL)).toEqual(true);
  });

  test('when call to apply method and order type is SELL then return false', () => {
    const buyStockOperation = new SellStockOperation();

    expect(buyStockOperation.apply(OrderOperationTypes.BUY)).toEqual(false);
  });

  test('when issuer have enough shares then return empty errors', () => {
    const [issuerName, totalShares, sharePrice] = [
      IssuerName.create('NFLA'),
      2,
      5,
    ];
    const account = AccountMother.create({
      cash: AccountCashMother.create(100),
      issuers: [IssuerMother.create(issuerName, totalShares, sharePrice)],
    });
    const order = OrderMother.create({
      totalShares: 1,
      sharePrice: 5,
      issuerName,
    });

    const buyStockOperation = new SellStockOperation();

    const result = buyStockOperation.execute(account, order);

    const expectedResult = { hasError: false, errors: [] };

    expect(result).toEqual(expectedResult);
  });

  test('when issuer not have enough shares then return INSUFFICIENT_STOCKS error', () => {
    const [issuerName, totalShares, sharePrice] = [
      IssuerName.create('NFLA'),
      2,
      5,
    ];
    const account = AccountMother.create({
      cash: AccountCashMother.create(100),
      issuers: [IssuerMother.create(issuerName, totalShares, sharePrice)],
    });
    const order = OrderMother.create({
      totalShares: 5,
      sharePrice: 5,
      issuerName,
    });

    const buyStockOperation = new SellStockOperation();

    const result = buyStockOperation.execute(account, order);

    const expectedResult = { hasError: true, errors: [INSUFFICIENT_STOCKS] };

    expect(result).toEqual(expectedResult);
  });
});
