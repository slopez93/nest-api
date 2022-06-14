import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class CreateAccountRequest {
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  cash: number;
}
