import { AccountCash } from '../valueObjects/AccountCash';
import { AccountId } from '../valueObjects/AccountId';
import { Issuer } from '../valueObjects/Issuer';

type Params = {
  cash: number;
};

export class Account {
  public id: AccountId;
  public cash: AccountCash;
  public issuers: Issuer[];

  constructor(id: AccountId, cash: AccountCash, issuers: Issuer[]) {
    this.id = id;
    this.cash = cash;
    this.issuers = issuers;
  }

  static create({ cash }: Params) {
    return new Account(AccountId.create(), AccountCash.create(cash), []);
  }

  public haveCashEnough(amount: number): boolean {
    return this.cash.value >= amount;
  }

  public setCash(amount: number): void {
    this.cash = AccountCash.create(amount);
  }

  public subtractCash(amount: number) {
    this.setCash(this.cash.value - amount);
  }

  public addCash(amount: number) {
    this.setCash(this.cash.value + amount);
  }

  public existIssuer(issuerName: string) {
    return !!this.getIssuer(issuerName);
  }

  public subtractIssuerSharePrice(
    issuerName: string,
    totalShares: number,
    sharePrice: number,
  ): void {
    const issuerIndex = this.getIssuerIndex(issuerName);
    const issuer = this.issuers[issuerIndex];

    if (!issuer) {
      this.addIssuer(issuerName, totalShares, sharePrice);
      return;
    }

    this.issuers[issuerIndex] = Issuer.create({
      name: issuerName,
      totalShares: issuer.totalShares - totalShares,
      sharePrice,
    });
  }

  public addIssuerSharePrice(
    issuerName: string,
    totalShares: number,
    sharePrice: number,
  ): void {
    const issuerIndex = this.getIssuerIndex(issuerName);
    const issuer = this.issuers[issuerIndex];

    if (!issuer) {
      this.addIssuer(issuerName, totalShares, sharePrice);
      return;
    }

    this.issuers[issuerIndex] = Issuer.create({
      name: issuerName,
      totalShares: issuer.totalShares + totalShares,
      sharePrice,
    });
  }

  public haveIssuerEnoughShares(issuerName: string, shares: number): boolean {
    const issuerShares = this.getIssuerShares(issuerName);
    return issuerShares >= shares;
  }

  private getIssuer(issuerName: string): Issuer {
    return this.issuers.find((issuer) => issuer.name.value === issuerName);
  }

  private getIssuerIndex(issuerName: string): number {
    return this.issuers.findIndex((issuer) => issuer.name.value === issuerName);
  }

  private getIssuerShares(issuerName: string): number {
    console.warn('EPAA', this.getIssuer(issuerName))
    return this.getIssuer(issuerName)?.totalShares ?? 0;
  }

  private addIssuer(
    issuerName: string,
    totalShares: number,
    sharePrice: number,
  ): void {
    this.issuers.push(
      Issuer.create({ name: issuerName, totalShares, sharePrice }),
    );
  }
}
