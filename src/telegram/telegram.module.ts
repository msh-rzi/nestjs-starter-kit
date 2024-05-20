import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramAuthRepository } from './repositories/telegram.auth.repository';
import { TelegramChannelsRepository } from './repositories/telegram.channel.repository';
import { TelegramEventRepository } from './repositories/telegram.event.repository';

@Module({
  controllers: [TelegramController],
  providers: [
    TelegramEventRepository,
    TelegramAuthRepository,
    TelegramChannelsRepository,
  ],
  exports: [
    TelegramEventRepository,
    TelegramAuthRepository,
    TelegramChannelsRepository,
  ],
})
export class TelegramModule {}
