import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SendOrderIntoAccountCommand } from 'src/modules/account/application/command/SendOrderIntoAccount';
import {
  SendOrderIntoAccountParams,
  SendOrderIntoAccountRequest,
} from './SendOrderIntoAccountRequest';

@Controller()
export class SendOrderIntoAccountController {
  constructor(private commandBus: CommandBus) {}

  @Post(':id/orders')
  public async sendOrderIntoAccount(
    @Param() params: SendOrderIntoAccountParams,
    @Body() body: SendOrderIntoAccountRequest,
  ) {
    const { id } = params;
    const { timestamp, operation, issuer_name, total_shares, share_price } =
      body;

    const response = await this.commandBus.execute(
      new SendOrderIntoAccountCommand(
        id,
        operation,
        issuer_name,
        total_shares,
        share_price,
        new Date(timestamp),
      ),
    );

    return response;
  }
}
