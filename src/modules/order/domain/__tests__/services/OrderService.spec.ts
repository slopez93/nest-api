import { QueryBus } from '@nestjs/cqrs';
import {
  DUPLICATED_OPERATION,
  MARKET_CLOSED,
} from 'src/modules/account/domain/errors/errors';
import { OrderService } from '../../services/OrderService';
import { OrderMother } from '../OrderMother';

describe('Test OrderService', () => {
  test('when have duplicated order then return DUPLICATED_OPERATION error', async () => {
    const order = OrderMother.create({});
    const duplicatedOrder = OrderMother.create({});
    const mockQueryBus = {
      execute: jest.fn().mockReturnValue([duplicatedOrder]),
    } as unknown as QueryBus;

    const orderService = new OrderService(mockQueryBus);

    const result = await orderService.duplicatedOrder(order);

    expect(result).toEqual([DUPLICATED_OPERATION]);
  });

  test('when have npt duplicated order then return empty errors', async () => {
    const order = OrderMother.create({});
    const mockQueryBus = {
      execute: jest.fn().mockReturnValue([]),
    } as unknown as QueryBus;

    const orderService = new OrderService(mockQueryBus);

    const result = await orderService.duplicatedOrder(order);

    expect(result).toEqual([]);
  });

  test('when market is open then return empty errors', async () => {
    const order = OrderMother.create({});
    jest.spyOn(order, 'isOnAllowedDate').mockReturnValue(true);
    const mockQueryBus = {
      execute: jest.fn().mockReturnValue([]),
    } as unknown as QueryBus;

    const orderService = new OrderService(mockQueryBus);

    const result = orderService.isMarketClosed(order);

    expect(result).toEqual([]);
  });

  test('when market is close then return MARKET_CLOSED error', async () => {
    const order = OrderMother.create({});
    jest.spyOn(order, 'isOnAllowedDate').mockReturnValue(false);
    const mockQueryBus = {
      execute: jest.fn().mockReturnValue([]),
    } as unknown as QueryBus;

    const orderService = new OrderService(mockQueryBus);

    const result = orderService.isMarketClosed(order);

    expect(result).toEqual([MARKET_CLOSED]);
  });
});
