export class SendOrderIntoAccountCommand {
  constructor(
    public accountId: string,
    public operation: string,
    public issuerName: string,
    public totalShares: number,
    public sharePrice: number,
    public date: Date,
  ) {}
}
