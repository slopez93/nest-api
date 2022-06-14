import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidIssuerName extends HttpException {
  constructor(name: string) {
    super(
      `Invalid issuer name: ${name}.Must be contain only 4 word in upper or lower case`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
