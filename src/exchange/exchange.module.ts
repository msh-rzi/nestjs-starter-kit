import { Module } from '@nestjs/common';
import { ExchangeController } from './exchange.controller';
import { ExchangeBaseRepository } from './repositories/exchange.base.repository';
import { ExchangeBybitHelper } from './helpers/exchange.bybit.helper';
import { BybitService } from './shared/bybit.service';
import { ExchangeBybitRepository } from './repositories/exchange.bybit.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
import { AuthHelpers } from 'src/auth/helpers/auth-helpers';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ExchangeController],
  providers: [
    JwtService,
    UserService,
    AuthHelpers,
    PrismaService,
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
