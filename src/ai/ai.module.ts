import { Module } from '@nestjs/common';
import { AiChatGPTRepository } from './repositories/ai.chatgpt.repository';

@Module({
  providers: [AiChatGPTRepository],
  exports: [AiChatGPTRepository],
})
export class AiModule {}
