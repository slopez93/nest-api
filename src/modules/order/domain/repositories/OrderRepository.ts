import { Order } from '../entities/Order';

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';

export interface OrderRepository {
  save(order: Order): Promise<void>;
  findDuplicated(order: Order): Promise<Order[]>;
}
