import { IntegerMother } from 'test/shared/IntegerMother';
import { AccountCash } from '../valueObjects/AccountCash';

export class AccountCashMother {
  static create(value: number): AccountCash {
    return new AccountCash(value);
  }

  static creator() {
    return () => AccountCashMother.random();
  }

  static random(): AccountCash {
    return this.create(IntegerMother.random());
  }
}
