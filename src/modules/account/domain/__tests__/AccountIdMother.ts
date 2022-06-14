import { AccountId } from "src/modules/account/domain/valueObjects/AccountId";
import { UuidMother } from "../../../../../test/shared/UuidMother";

export class AccountIdMother {
    static create(value: string): AccountId {
      return new AccountId(value);
    }
  
    static creator() {
      return () => AccountIdMother.random();
    }
  
    static random(): AccountId {
      return this.create(UuidMother.random());
    }
  }
  