import { IssuerName } from 'src/shared/domain/IssuerName';
import { IntegerMother } from 'test/shared/IntegerMother';
import { WordMother } from 'test/shared/WordMother';
import { Issuer } from '../valueObjects/Issuer';

export class IssuerMother {
  static create(
    name: IssuerName,
    totalShares: number,
    sharePrice: number,
  ): Issuer {
    return new Issuer(name, totalShares, sharePrice);
  }

  static creator() {
    return () => IssuerMother.random();
  }

  static random(): Issuer {
    return this.create(
      IssuerName.create(WordMother.random(4)),
      IntegerMother.random(),
      IntegerMother.random(),
    );
  }
}
