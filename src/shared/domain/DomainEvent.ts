import { v4 } from 'uuid';

export abstract class DomainEvent {
  readonly eventName: string;
  readonly aggregateId: string;
  readonly id: string;
  readonly timestamp: Date;

  constructor(
    eventName: string,
    aggregateId: string,
    id?: string,
    timestamp?: Date,
  ) {
    this.eventName = eventName;
    this.aggregateId = aggregateId;
    this.id = id || v4();
    this.timestamp = timestamp || new Date();
  }

  abstract toDTO(): Object;
}
