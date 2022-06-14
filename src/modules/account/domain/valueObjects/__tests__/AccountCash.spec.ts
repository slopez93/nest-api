import { AccountCash } from '../AccountCash';

describe('Test AccountCash VO', () => {
  test('when create account cash with positive number then check VO contain this amount', () => {
    const result = AccountCash.create(100);

    expect(result.value).toEqual(100);
  });

  test('when create account cash with negative number then throw exception', () => {
    expect(() => {
      AccountCash.create(-100);
    }).toThrow('Cash account must be greater than 0 to initialize account');
  });
});
