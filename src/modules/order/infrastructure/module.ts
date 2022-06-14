import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DynamoDbClient } from 'src/shared/infrastructure/services/DynamoDbClient';
import { OrderCreatedEventHandler } from '../application/eventHandlers/OrderCreatedEventHandler';
import { OrderProfile } from '../application/mappers/OrderProfile';
import { FindDuplicatedOrdersQueryHandler } from '../application/queryHandlers/FindDuplicatedOrdersQueryHandler';
import { ORDER_REPOSITORY } from '../domain/repositories/OrderRepository';
import { OrderService } from '../domain/services/OrderService';
import { DynamoDbOrderRepository } from './persistence/DynamoDbOrderRespository';

const EventsHandlers = [
  OrderCreatedEventHandler,
  FindDuplicatedOrdersQueryHandler,
];

@Module({
  imports: [CqrsModule],
  providers: [
    OrderService,
    OrderProfile,
    DynamoDbClient,
    { useClass: DynamoDbOrderRepository, provide: ORDER_REPOSITORY },
    ...EventsHandlers,
  ],
  exports: [OrderService],
})
export class OrderModule {}
