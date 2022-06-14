import { createMap, forMember, mapFrom } from '@automapper/core';
import type { Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { AccountDto } from '../dtos/AccountDto';
import { Account } from '../../domain/entities/Account';
import { AccountId } from '../../domain/valueObjects/AccountId';
import { AccountCash } from '../../domain/valueObjects/AccountCash';
import { Issuer } from '../../domain/valueObjects/Issuer';

@Injectable()
export class AccountProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        AccountDto,
        Account,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => AccountId.create(source.id)),
        ),
        forMember(
          (destination) => destination.cash,
          mapFrom((source) => AccountCash.create(source.cash)),
        ),
        forMember(
          (destination) => destination.issuers,
          mapFrom((source) =>
            source.issuers.map((issuer) =>
              Issuer.create({
                name: issuer.issuer_name,
                totalShares: issuer.total_shares,
                sharePrice: issuer.share_price,
              }),
            ),
          ),
        ),
      );

      createMap(
        mapper,
        Account,
        AccountDto,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source.id.toString()),
        ),
        forMember(
          (destination) => destination.cash,
          mapFrom((source) => Number(source.cash.value)),
        ),
        forMember(
          (destination) => destination.issuers,
          mapFrom((source) =>
            source.issuers.map((issuer) => ({
              issuer_name: issuer.name.value,
              total_shares: issuer.totalShares,
              share_price: issuer.sharePrice,
            })),
          ),
        ),
      );
    };
  }
}
