import { UuidMother } from "../../../../../test/shared/UuidMother";
import { OrderId } from "../valueObjects/OrderId";

export class OrderIdMother {
    static create(value: string): OrderId {
      return new OrderId(value);
    }
  
    static creator() {
      return () => OrderIdMother.random();
    }
  
    static random(): OrderId {
      return this.create(UuidMother.random());
    }
  }
  