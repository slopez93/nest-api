export class OrderDto {
  constructor(
    public id: string,
    public accountId: string,
    public operation: string,
    public issuer_name: string,
    public total_shares: number,
    public share_price: number,
    public createdAt: string,
  ) {}
}
