import { Module } from '@nestjs/common';
import { ExchangeController } from './exchange.controller';
import { ExchangeBaseRepository } from './repositories/exchange.base.repository';
import { ExchangeBybitHelper } from './helpers/exchange.bybit.helper';
import { BybitService } from './shared/bybit.service';
import { ExchangeBybitRepository } from './repositories/exchange.bybit.repository';

@Module({
  controllers: [ExchangeController],
  providers: [
    ExchangeBaseRepository,
    ExchangeBybitHelper,
    BybitService,
    ExchangeBybitRepository,
  ],
  exports: [
    ExchangeBaseRepository,
    ExchangeBybitHelper,
    BybitService,
    ExchangeBybitRepository,
  ],
})
export class ExchangeModule {}
