import { Order } from '../../domain/entities/Order';

export class FindDuplicatedOrdersQuery {
  constructor(public order: Order) {}
}
