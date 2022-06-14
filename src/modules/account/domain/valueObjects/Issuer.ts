import { IssuerName } from '../../../../shared/domain/IssuerName';

type Params = {
  name: string;
  totalShares: number;
  sharePrice: number;
};

export class Issuer {
  public name: IssuerName;
  public totalShares: number;
  public sharePrice: number;

  constructor(name: IssuerName, totalShares: number, sharePrice: number) {
    this.name = name;
    this.totalShares = totalShares;
    this.sharePrice = sharePrice;
  }

  static create({ name, totalShares, sharePrice }: Params) {
    return new Issuer(IssuerName.create(name), totalShares, sharePrice);
  }
}
