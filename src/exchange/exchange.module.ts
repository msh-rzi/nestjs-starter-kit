import { Module } from '@nestjs/common';
import { ExchangeController } from './exchange.controller';
import { ExchangeBaseRepository } from './repositories/exchange.base.repository';

@Module({
  controllers: [ExchangeController],
  providers: [ExchangeBaseRepository],
})
export class ExchangeModule {}
