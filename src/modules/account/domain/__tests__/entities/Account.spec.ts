import { IssuerName } from 'src/shared/domain/IssuerName';
import { AccountCashMother } from '../AccountCashMother';
import { AccountMother } from '../AccountMother';
import { IssuerMother } from '../IssuerMother';

describe('Test Account entity', () => {
  test('when call to haveCashEnough and user have cash then return true', () => {
    const account = AccountMother.create({
      cash: AccountCashMother.create(100),
    });

    expect(account.haveCashEnough(10)).toEqual(true);
  });

  test('when set cash then check that the cash has been setted', () => {
    const account = AccountMother.create({});
    account.setCash(100);

    expect(account.cash.value).toEqual(100);
  });

  test('when subtract cash to account then check that the cass has been subscracted', () => {
    const account = AccountMother.create({
      cash: AccountCashMother.create(100),
    });
    account.subtractCash(100);

    expect(account.cash.value).toEqual(0);
  });

  test('when add cash to account then check that the cass has been added', () => {
    const account = AccountMother.create({
      cash: AccountCashMother.create(100),
    });
    account.addCash(100);

    expect(account.cash.value).toEqual(200);
  });

  test('when account have an NTFL and call to existIssuer issuer then return true', () => {
    const account = AccountMother.create({
      issuers: [IssuerMother.create(IssuerName.create('NTFL'), 1, 5)],
    });

    const result = account.existIssuer('NTFL');

    expect(result).toEqual(true);
  });

  test('when account not have an NTFL and call to existIssuer issuer then return false', () => {
    const account = AccountMother.create({
      issuers: [IssuerMother.create(IssuerName.create('TEST'), 1, 5)],
    });

    const result = account.existIssuer('NTFL');

    expect(result).toEqual(false);
  });

  test('when exist issuer and substract total share then rest total shares to this issuer', () => {
    const [mockIssuerName, totalShares, sharePrice] = ['NTFL', 2, 5];
    const account = AccountMother.create({
      issuers: [
        IssuerMother.create(
          IssuerName.create(mockIssuerName),
          totalShares,
          sharePrice,
        ),
      ],
    });

    account.subtractIssuerSharePrice(mockIssuerName, 2, 5);

    expect(account.issuers[0].totalShares).toEqual(0);
    expect(account.issuers[0].sharePrice).toEqual(sharePrice);
  });

  // TODO: Pending do test when issuer not exist

  test('when exist issuer and add total share then add total shares to this issuer', () => {
    const [mockIssuerName, totalShares, sharePrice] = ['NTFL', 2, 5];
    const account = AccountMother.create({
      issuers: [
        IssuerMother.create(
          IssuerName.create(mockIssuerName),
          totalShares,
          sharePrice,
        ),
      ],
    });

    account.addIssuerSharePrice(mockIssuerName, 2, 5);

    expect(account.issuers[0].totalShares).toEqual(4);
    expect(account.issuers[0].sharePrice).toEqual(sharePrice);
  });

  test('when issuer have shares then return true', () => {
    const account = AccountMother.create({
      issuers: [IssuerMother.create(IssuerName.create('NTFL'), 2, 5)],
    });

    const result = account.haveIssuerEnoughShares('NTFL', 1);

    expect(result).toEqual(true);
  });

  test('when issuer not have shares then return false', () => {
    const account = AccountMother.create({
      issuers: [IssuerMother.create(IssuerName.create('NTFL'), 2, 5)],
    });

    const result = account.haveIssuerEnoughShares('NTFL', 3);

    expect(result).toEqual(false);
  });
});
