import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramAuthRepository } from './repositories/telegram.auth.repository';
import { TelegramChannelsRepository } from './repositories/telegram.channel.repository';
import { TelegramEventRepository } from './repositories/telegram.event.repository';
import { AiChatGPTRepository } from 'src/ai/repositories/ai.chatgpt.repository';
import { ExchangeBybitRepository } from 'src/exchange/repositories/exchange.bybit.repository';

@Module({
  controllers: [TelegramController],
  providers: [
    TelegramEventRepository,
    TelegramAuthRepository,
    TelegramChannelsRepository,
    AiChatGPTRepository,
    ExchangeBybitRepository,
  ],
  exports: [
    TelegramEventRepository,
    TelegramAuthRepository,
    TelegramChannelsRepository,
  ],
})
export class TelegramModule {}
