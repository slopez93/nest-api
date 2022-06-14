import MockDate from 'mockdate';
import { UuidMother } from 'test/shared/UuidMother';
import { WordMother } from 'test/shared/WordMother';
import { Order } from '../../entities/Order';
import { OrderMother } from '../OrderMother';

afterEach(() => {
  MockDate.reset();
});

describe('Test Order entity', () => {
  test('when create order from name constructor then check that domain event was created', () => {
    const order = Order.create({
      accountId: UuidMother.random(),
      issuerName: WordMother.random(4),
      operation: 'BUY',
      totalShares: 1,
      sharePrice: 5,
      createdAt: new Date(),
    });

    expect(order.getUncommittedEvents().length).toEqual(1);
  });
  test('when call getTotalPrice then return totalShares * sharePrice', () => {
    const order = OrderMother.create({
      totalShares: 4,
      sharePrice: 5,
    });

    expect(order.getTotalPrice()).toEqual(20);
  });

  test('when time 15pm then order is allowed', () => {
    MockDate.set(new Date().setHours(6, 0, 0, 0));

    const order = OrderMother.create({});

    expect(order.isOnAllowedDate()).toEqual(true);
  });

  test('when time is 14:20pm then order is allowed', () => {
    MockDate.set(new Date().setHours(14, 20, 0, 0));

    const order = OrderMother.create({});

    expect(order.isOnAllowedDate()).toEqual(true);
  });

  test('when time is 2am then order is not allowed', () => {
    MockDate.set(new Date().setHours(2, 0, 0, 0));

    const order = OrderMother.create({});

    expect(order.isOnAllowedDate()).toEqual(false);
  });

  test('when time is 5:59am and 15pm then order is not allowed', () => {
    MockDate.set(new Date().setHours(5, 59, 0, 0));

    const order = OrderMother.create({});

    expect(order.isOnAllowedDate()).toEqual(false);
  });
});
