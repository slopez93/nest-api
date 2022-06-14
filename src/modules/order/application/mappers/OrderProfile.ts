import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { AccountId } from 'src/modules/account/domain/valueObjects/AccountId';
import { IssuerName } from 'src/shared/domain/IssuerName';
import { Order } from '../../domain/entities/Order';
import { OrderId } from '../../domain/valueObjects/OrderId';
import { OrderDto } from '../dtos/OrderDto';

@Injectable()
export class OrderProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        OrderDto,
        Order,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => OrderId.create(source.id)),
        ),
        forMember(
          (destination) => destination.accountId,
          mapFrom((source) => AccountId.create(source.accountId)),
        ),
        forMember(
          (destination) => destination.operation,
          mapFrom((source) => source.operation),
        ),
        forMember(
          (destination) => destination.issuerName,
          mapFrom((source) => IssuerName.create(source.issuer_name)),
        ),
        forMember(
          (destination) => destination.totalShares,
          mapFrom((source) => source.total_shares),
        ),
        forMember(
          (destination) => destination.sharePrice,
          mapFrom((source) => source.share_price),
        ),
        forMember(
          (destination) => destination.createdAt,
          mapFrom((source) => new Date(source.createdAt)),
        ),
      );

      createMap(
        mapper,
        Order,
        OrderDto,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source.id.value),
        ),
        forMember(
          (destination) => destination.accountId,
          mapFrom((source) => source.accountId.value),
        ),
        forMember(
          (destination) => destination.operation,
          mapFrom((source) => source.operation),
        ),
        forMember(
          (destination) => destination.issuer_name,
          mapFrom((source) => source.issuerName.value),
        ),
        forMember(
          (destination) => destination.total_shares,
          mapFrom((source) => source.totalShares),
        ),
        forMember(
          (destination) => destination.share_price,
          mapFrom((source) => source.sharePrice),
        ),
        forMember(
          (destination) => destination.createdAt,
          mapFrom((source) => source.createdAt.toISOString()),
        ),
      );
    };
  }
}
