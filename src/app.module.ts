import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { TelegramModule } from './telegram/telegram.module';
import { ExchangeModule } from './exchange/exchange.module';
import { AiModule } from './ai/ai.module';
import { AlgorithmModule } from './algorithm/algorithm.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, TelegramModule, ExchangeModule, AiModule, AlgorithmModule],
  providers: [PrismaService],
})
export class AppModule {}
