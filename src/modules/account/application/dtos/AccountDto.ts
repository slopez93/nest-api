type Issuer = {
  issuer_name: string;
  total_shares: number;
  share_price: number;
};

export class AccountDto {
  constructor(
    public id: string,
    public cash: number,
    public issuers: Issuer[],
  ) {}
}
