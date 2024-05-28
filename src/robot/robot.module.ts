import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RobotTelegramTradeAutomationRepository } from './repositories/robot.telegram.trade.automation.repository';
import { RobotBaseRepository } from './repositories/robot.base.repository';
import { RobotController } from './robot.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [RobotController],
  providers: [
    RobotBaseRepository,
    RobotTelegramTradeAutomationRepository,
    PrismaService,
  ],
  exports: [RobotBaseRepository, RobotTelegramTradeAutomationRepository],
})
export class RobotModule {}
