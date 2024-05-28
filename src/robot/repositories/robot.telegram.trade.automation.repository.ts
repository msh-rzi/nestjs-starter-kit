import { Injectable } from '@nestjs/common';
// services
import { PrismaService } from 'src/prisma/prisma.service';
import { RobotBaseRepository } from './robot.base.repository';
// types
import { UserRobots, Robots } from '@prisma/client';
import { GlobalResponseType } from 'src/types/globalTypes';

@Injectable()
export class RobotTelegramTradeAutomationRepository {
  tradeAutomationRobot: Robots;
  constructor(
    private readonly prisma: PrismaService,
    private readonly service: RobotBaseRepository,
  ) {
    this.prisma.robots
      .findFirst({
        where: { name: 'Telegram Trade Automaton' },
      })
      .then((res) => {
        this.tradeAutomationRobot = res;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async getRobotUserById(
    userId: string,
  ): Promise<GlobalResponseType<{ robot?: UserRobots; error?: any }>> {
    return await this.service.getUserRobotById(
      userId,
      this.tradeAutomationRobot.id,
    );
  }

  async createRobotUser(
    usersId: string,
  ): Promise<GlobalResponseType<{ robot?: UserRobots; error?: any }>> {
    return await this.service.createRobotUser(
      usersId,
      this.tradeAutomationRobot.id,
    );
  }

  async updateRobotUserData(
    usersId: string,
    cancelReason?: string,
  ): Promise<boolean> {
    return await this.service.updateRobotUserData(
      usersId,
      this.tradeAutomationRobot.id,
      cancelReason,
    );
  }

  async start(usersId: string) {
    const robot = (await this.getRobotUserById(usersId)).result.robot;

    // Create new entry or update existing entry for Telegram Trade Automation
    if (!robot) {
      await this.createRobotUser(usersId);
    } else if (!robot.active) {
      await this.updateRobotUserData(usersId);
    }
  }
}
