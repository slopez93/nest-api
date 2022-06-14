import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateAccountController } from 'src/apps/api/controllers/createAccount/CreateAccountController';
import { FindAccountController } from 'src/apps/api/controllers/findAccount/FindAccountController';
import { SendOrderIntoAccountController } from 'src/apps/api/controllers/sendOrderIntoAccount/SendOrderIntoAccountController';
import { OrderModule } from 'src/modules/order/infrastructure/module';
import { DynamoDbClient } from 'src/shared/infrastructure/services/DynamoDbClient';
import { CreateAccountCommandHandler } from '../application/commandHandlers/CreateAccountCommandHandler';
import { SendOrderIntoAccountCommandHandler } from '../application/commandHandlers/SendOrderIntoAccountCommandHandler';
import { AccountProfile } from '../application/mappers/AccountProfile';
import { FindAccountQueryHandler } from '../application/queryHandlers/FindAccountQueryHandler';
import { ACCOUNT_REPOSITORY } from '../domain/repositories/AccountRepository';
import { BuyStockOperation } from '../domain/strategies/BuyStockOperation';
import { SellStockOperation } from '../domain/strategies/SellStockOperation';
import { STOCK_OPERATION } from '../domain/strategies/StockOperation';
import { DynamoDbAccountRepository } from './persistence/DynamoDbAccountRespository';

const AccountCommandHandlers = [
  CreateAccountCommandHandler,
  SendOrderIntoAccountCommandHandler,
];
const AccountQueryHandlers = [FindAccountQueryHandler];

@Module({
  imports: [CqrsModule, OrderModule],
  providers: [
    Logger,
    AccountProfile,
    DynamoDbClient,
    BuyStockOperation,
    SellStockOperation,
    {
      provide: STOCK_OPERATION,
      useFactory: (...deps) => [...deps],
      inject: [BuyStockOperation, SellStockOperation],
    },
    { useClass: DynamoDbAccountRepository, provide: ACCOUNT_REPOSITORY },
    ...AccountCommandHandlers,
    ...AccountQueryHandlers,
  ],
  exports: [...AccountQueryHandlers],
  controllers: [
    CreateAccountController,
    FindAccountController,
    SendOrderIntoAccountController,
  ],
})
export class AccountModule {}
