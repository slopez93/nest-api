import { Account } from "../entities/Account";

export const ACCOUNT_REPOSITORY = 'ACCOUNT_REPOSITORY';

export interface AccountRepository {
  save(account: Account): Promise<void>;
  findById(id: string): Promise<Account>;
}
