import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramAuthRepository } from './repositories/telegram.auth.repository';
import { TelegramChannelsRepository } from './repositories/telegram.channel.repository';
import { TelegramEventRepository } from './repositories/telegram.event.repository';
import { ExchangeModule } from 'src/exchange/exchange.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TelegramHelpers } from './helpers/telegram.helpers';
import { AiModule } from 'src/ai/ai.module';
import { AuthModule } from 'src/auth/auth.module';
import { AlgorithmModule } from 'src/algorithm/algorithm.module';
import { RobotModule } from 'src/robot/robot.module';

@Module({
  imports: [
    ExchangeModule,
    PrismaModule,
    AiModule,
    AuthModule,
    AlgorithmModule,
    RobotModule,
  ],
  controllers: [TelegramController],
  providers: [
    TelegramEventRepository,
    TelegramAuthRepository,
    TelegramChannelsRepository,
    TelegramHelpers,
  ],
  exports: [
    TelegramEventRepository,
    TelegramAuthRepository,
    TelegramChannelsRepository,
  ],
})
export class TelegramModule {}
