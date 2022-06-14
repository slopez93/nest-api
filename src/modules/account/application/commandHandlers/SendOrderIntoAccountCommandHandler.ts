import { Inject, Logger } from '@nestjs/common';
import {
  CommandHandler,
  EventPublisher,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { Order } from 'src/modules/order/domain/entities/Order';
import { Account } from '../../domain/entities/Account';
import {
  StockOperation,
  STOCK_OPERATION,
} from '../../domain/strategies/StockOperation';
import { SendOrderIntoAccountCommand } from '../command/SendOrderIntoAccount';
import { FindAccountQuery } from '../query/FindAccountQuery';
import * as Errors from '../../domain/errors/errors';
import {
  AccountRepository,
  ACCOUNT_REPOSITORY,
} from '../../domain/repositories/AccountRepository';
import { OrderService } from 'src/modules/order/domain/services/OrderService';

@CommandHandler(SendOrderIntoAccountCommand)
export class SendOrderIntoAccountCommandHandler
  implements ICommandHandler<SendOrderIntoAccountCommand>
{
  constructor(
    private logger: Logger,
    private queryBus: QueryBus,
    private eventBus: EventPublisher,
    private orderService: OrderService,
    @Inject(ACCOUNT_REPOSITORY) private repository: AccountRepository,
    @Inject(STOCK_OPERATION) private stockOperationHandlers: StockOperation[],
  ) {}

  public async execute(command: SendOrderIntoAccountCommand): Promise<any> {
    const { accountId, operation, issuerName, totalShares, sharePrice, date } =
      command;

    const account: Account = await this.queryBus.execute(
      new FindAccountQuery(accountId),
    );

    this.logger.log(`sending order into account with id ${accountId}`);

    let order = Order.create({
      accountId,
      operation,
      issuerName,
      totalShares,
      sharePrice,
      createdAt: date,
    });

    order = this.eventBus.mergeObjectContext(order);

    let businessErrors = [];

    const duplicatedOrderError = await this.orderService.duplicatedOrder(order);

    const isMarketCloseError = this.orderService.isMarketClosed(order);

    businessErrors = businessErrors.concat(
      duplicatedOrderError,
      isMarketCloseError,
    );

    const stockOperationHandler = this.stockOperationHandlers.find((handler) =>
      handler.apply(operation),
    );

    if (stockOperationHandler && businessErrors.length === 0) {
      const operationResult = stockOperationHandler.execute(account, order);

      if (operationResult.hasError) {
        this.logError(operationResult.errors);
        businessErrors.push(operationResult.errors);
      } else {
        this.repository.save(account);
        order.commit();
        this.logger.log(
          `success send order into account: Order: ${order.id.toString()}, Account: ${accountId}`,
        );
      }
    } else {
      this.logError(businessErrors);
      if (!stockOperationHandler) businessErrors.push(Errors.INVALID_OPERATION);
    }

    return {
      currentBalance: {
        cash: account.cash.value,
        issuers: account.issuers.map((issuer) => ({
          issuer_name: issuer.name.value,
          total_shares: issuer.totalShares,
          share_price: issuer.sharePrice,
        })),
      },
      business_errors: [...businessErrors],
    };
  }

  private logError(errors: string[] | string): void {
    this.logger.error(
      `error sending order into account, reason: ${errors.toString()}`,
    );
  }
}
