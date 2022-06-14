import { v4 as uuid, validate } from 'uuid';

export class Uuid {
  readonly value: string;

  constructor(value: string) {
    this.ensureIsValidUuid(value);

    this.value = value;
  }

  static create(value?: string) {
    return new Uuid(value || uuid());
  }

  private ensureIsValidUuid(value: string) {
    if (!validate(value)) {
      throw new Error(
        `${this.constructor.name} does not allow the value ${value}`,
      );
    }
  }

  public toString(): string {
    return this.value;
  }
}
