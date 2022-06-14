export class AccountCash {
  readonly value: number;

  constructor(value: number) {
    this.ensureValidCash(value);

    this.value = value;
  }

  static create(value: number) {
    return new AccountCash(value);
  }

  private ensureValidCash(value: number) {
    if (value < 0) {
      throw new Error(
        'Cash account must be greater than 0 to initialize account',
      );
    }
  }
}
