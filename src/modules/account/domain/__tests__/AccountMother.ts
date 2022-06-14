import { Account } from '../entities/Account';
import { AccountIdMother } from './AccountIdMother';
import { AccountCashMother } from './AccountCashMother';
import { IssuerMother } from './IssuerMother';

export class AccountMother {
  static create({
    id = AccountIdMother.random(),
    cash = AccountCashMother.random(),
    issuers = [IssuerMother.random()],
  }: Partial<Account>) {
    return new Account(id, cash, issuers);
  }
}
