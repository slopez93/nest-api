import { InvalidIssuerName } from '../../modules/account/domain/exceptions/InvalidIssuerName';

const VALID_REGEX = /^[A-Za-z]{4}$/;

export class IssuerName {
  public readonly value: string;

  constructor(value: string) {
    this.ensureValidIssuerName(value);
    this.value = value;
  }

  static create(value: string) {
    return new IssuerName(value);
  }

  private ensureValidIssuerName(value: string) {
    if (!VALID_REGEX.test(value)) {
      throw new InvalidIssuerName(value);
    }
  }
}
