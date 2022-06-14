import { HttpException, HttpStatus } from '@nestjs/common';

export class AccountNotHaveEnoughCash extends HttpException {
  constructor(accountId: string) {
    super(
      `Account with id: ${accountId} not have enough cash`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
