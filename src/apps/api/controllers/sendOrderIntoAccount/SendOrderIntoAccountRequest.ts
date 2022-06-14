import { IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class SendOrderIntoAccountParams {
  @IsUUID()
  id: string;
}

export class SendOrderIntoAccountRequest {
  @IsNumber()
  timestamp: number;

  @IsString()
  operation: string;

  @IsString()
  issuer_name: string;

  @IsNumber()
  @IsPositive()
  total_shares: number;

  @IsNumber()
  @IsPositive()
  share_price: number;
}
