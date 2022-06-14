import { Logger } from '@nestjs/common';
import { EventPublisher, QueryBus } from '@nestjs/cqrs';
import { instance, mock, reset, verify, when, anyOfClass } from 'ts-mockito';
import { BuyStockOperation } from 'src/modules/account/domain/strategies/BuyStockOperation';
import { SellStockOperation } from 'src/modules/account/domain/strategies/SellStockOperation';
import { AccountCashMother } from 'src/modules/account/domain/__tests__/AccountCashMother';
import { AccountMother } from 'src/modules/account/domain/__tests__/AccountMother';
import { IssuerMother } from 'src/modules/account/domain/__tests__/IssuerMother';
import {
  Order,
  OrderOperationTypes,
} from 'src/modules/order/domain/entities/Order';
import { OrderService } from 'src/modules/order/domain/services/OrderService';
import { OrderMother } from 'src/modules/order/domain/__tests__/OrderMother';
import { IssuerName } from 'src/shared/domain/IssuerName';
import { SendOrderIntoAccountCommand } from '../../command/SendOrderIntoAccount';
import { SendOrderIntoAccountCommandHandler } from '../../commandHandlers/SendOrderIntoAccountCommandHandler';
import { AccountRepository } from 'src/modules/account/domain/repositories/AccountRepository';
import { FindAccountQuery } from '../../query/FindAccountQuery';

describe('Test SendOrderCommandHandler', () => {
  const mockLogger = mock<Logger>();
  const mockQueryBus = mock<QueryBus>();
  const mockEventBus = mock<EventPublisher>();
  const mockOrderService = mock<OrderService>();
  const mockAccountRepository = mock<AccountRepository>();
  const mockStockOperationHandlers = [
    new BuyStockOperation(),
    new SellStockOperation(),
  ];

  afterEach(() => {
    reset(mockLogger);
    reset(mockQueryBus);
    reset(mockEventBus);
    reset(mockOrderService);
    reset(mockAccountRepository);
  });

  test('when send BUY order into account then execute order and subsctract cash from the account', async () => {
    const issuerName = IssuerName.create('NFLA');
    const issuerTotalShares = 5;
    const issuerSharePrice = 5;
    const issuer = IssuerMother.create(
      issuerName,
      issuerTotalShares,
      issuerSharePrice,
    );
    const account = AccountMother.create({
      issuers: [issuer],
      cash: AccountCashMother.create(100),
    });
    const order = OrderMother.create({
      issuerName: issuer.name,
      operation: OrderOperationTypes.BUY,
      totalShares: 1,
      sharePrice: 5,
    });

    when(mockQueryBus.execute(anyOfClass(FindAccountQuery))).thenResolve(
      account,
    );
    when(mockEventBus.mergeObjectContext(anyOfClass(Order))).thenReturn(order);
    when(mockOrderService.duplicatedOrder(order)).thenResolve([]);
    when(mockOrderService.isMarketClosed(order)).thenReturn([]);
    when(mockAccountRepository.save(account)).thenResolve();

    const logger = instance(mockLogger);
    const queryBus = instance(mockQueryBus);
    const eventBus = instance(mockEventBus);
    const orderService = instance(mockOrderService);
    const accountRepository = instance(mockAccountRepository);

    const commandHandler = new SendOrderIntoAccountCommandHandler(
      logger,
      queryBus,
      eventBus,
      orderService,
      accountRepository,
      mockStockOperationHandlers,
    );
    const result = await commandHandler.execute(
      new SendOrderIntoAccountCommand(
        account.id.toString(),
        order.operation,
        order.issuerName.value,
        order.totalShares,
        order.sharePrice,
        order.createdAt,
      ),
    );

    verify(mockQueryBus.execute(anyOfClass(FindAccountQuery))).once();
    verify(mockEventBus.mergeObjectContext(anyOfClass(Order))).once();
    verify(mockOrderService.duplicatedOrder(order)).once();
    verify(mockOrderService.isMarketClosed(order)).once();
    verify(mockAccountRepository.save(account)).once();

    expect(result).toEqual({
      currentBalance: {
        cash: 95,
        issuers: [
          {
            issuer_name: issuerName.value,
            total_shares: 6,
            share_price: 5,
          },
        ],
      },
      business_errors: [],
    });
  });
});
