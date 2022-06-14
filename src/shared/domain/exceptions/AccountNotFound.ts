import { HttpException, HttpStatus } from '@nestjs/common';

export class AccountNotFound extends HttpException {
  constructor(accountId: string) {
    super(`Account with id: ${accountId} not found`, HttpStatus.NOT_FOUND);
  }
}
