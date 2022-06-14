import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { AccountModule } from 'src/modules/account/infrastructure/module';
import { OrderModule } from 'src/modules/order/infrastructure/module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AccountModule,
    OrderModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    RouterModule.register([
      {
        path: '/accounts',
        module: AccountModule,
      },
    ]),
  ],
})
export class AppModule {}
