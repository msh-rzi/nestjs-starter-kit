import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseCode, ResponseMessage } from 'src/types/globalEnums';
import { GlobalResponseType } from 'src/types/globalTypes';
import { globalResponse } from 'src/utils/globalResponse';
import { UserRobots, Robots } from '@prisma/client';

@Injectable()
export class RobotBaseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addRobot(
    name: string,
    description: string,
    path: string,
  ): Promise<GlobalResponseType<{ error?: any }>> {
    try {
      await this.prisma.robots.create({
        data: { name, description, path },
      });
      return globalResponse({
        retCode: ResponseCode.OK,
        regMsg: ResponseMessage.OK,
        result: {},
        retExtInfo: '',
      });
    } catch (error) {
      console.log('can not add robot');
      return globalResponse({
        retCode: ResponseCode.INTERNAL_SERVER_ERROR,
        regMsg: ResponseMessage.ERROR,
        result: { error },
        retExtInfo: 'Internal server error',
      });
    }
  }

  async getUserRobots(
    usersId: string,
  ): Promise<GlobalResponseType<{ userRobots?: UserRobots[]; error?: any }>> {
    try {
      const userRobots = await this.prisma.userRobots.findMany({
        where: { usersId: usersId },
      });

      return globalResponse({
        retCode: ResponseCode.OK,
        regMsg: ResponseMessage.OK,
        result: { userRobots },
        retExtInfo: '',
      });
    } catch (error) {
      console.log('can not get active robots for user id: ' + usersId);
      return globalResponse({
        retCode: ResponseCode.INTERNAL_SERVER_ERROR,
        regMsg: ResponseMessage.ERROR,
        result: { error },
        retExtInfo: 'Internal server error',
      });
    }
  }

  async getAllUsersRobots(): Promise<UserRobots[]> {
    return await this.prisma.userRobots.findMany();
  }

  async getUserRobotById(
    userId: string,
    robotsId: string,
  ): Promise<GlobalResponseType<{ robot?: UserRobots; error?: any }>> {
    try {
      const robot = await this.prisma.userRobots.findFirst({
        where: { usersId: userId, robotsId },
      });
      return globalResponse({
        retCode: ResponseCode.OK,
        regMsg: ResponseMessage.OK,
        result: { robot },
        retExtInfo: '',
      });
    } catch (error) {
      return globalResponse({
        retCode: ResponseCode.INTERNAL_SERVER_ERROR,
        regMsg: ResponseMessage.ERROR,
        result: {},
        retExtInfo: 'Internal Server Error',
      });
    }
  }

  async getRobotById(
    robotId: string,
  ): Promise<GlobalResponseType<{ robot?: Robots; error?: any }>> {
    try {
      const robot = await this.prisma.robots.findFirst({
        where: { id: robotId },
      });

      return globalResponse({
        retCode: ResponseCode.OK,
        regMsg: ResponseMessage.OK,
        result: { robot },
        retExtInfo: '',
      });
    } catch (error) {
      console.log('can not get robots');
      return globalResponse({
        retCode: ResponseCode.INTERNAL_SERVER_ERROR,
        regMsg: ResponseMessage.ERROR,
        result: { error },
        retExtInfo: 'Internal server error',
      });
    }
  }

  async getRobots(): Promise<
    GlobalResponseType<{ robots?: Robots[]; error?: any }>
  > {
    try {
      const robots = await this.prisma.robots.findMany();
      return globalResponse({
        retCode: ResponseCode.OK,
        regMsg: ResponseMessage.OK,
        result: { robots },
        retExtInfo: '',
      });
    } catch (error) {
      console.log('can not get robots');
      return globalResponse({
        retCode: ResponseCode.INTERNAL_SERVER_ERROR,
        regMsg: ResponseMessage.ERROR,
        result: { error },
        retExtInfo: 'Internal server error',
      });
    }
  }

  async createRobotUser(
    usersId: string,
    robotsId: string,
  ): Promise<GlobalResponseType<{ isCreated?: boolean; error?: any }>> {
    try {
      const userRobot = await this.prisma.userRobots.create({
        data: { usersId, robotsId },
      });

      return globalResponse({
        retCode: ResponseCode.OK,
        regMsg: ResponseMessage.OK,
        result: { isCreated: !!userRobot },
        retExtInfo: '',
      });
    } catch (error) {
      console.log('can not create robot user');
      return globalResponse({
        retCode: ResponseCode.INTERNAL_SERVER_ERROR,
        regMsg: ResponseMessage.ERROR,
        result: { error },
        retExtInfo: 'Internal server error',
      });
    }
  }

  async updateRobotUserData(
    usersId: string,
    robotsId: string,
    cancelReason?: string,
  ): Promise<boolean> {
    try {
      const robot = await this.prisma.userRobots.findFirst({
        where: {
          usersId,
          robotsId,
        },
      });

      if (robot) {
        const updateData = cancelReason
          ? { cancelReason, canceledAt: new Date() }
          : { startedAt: new Date() };
        await this.prisma.robots.update({
          where: { id: robot.id },
          data: updateData,
        });
        return true;
      } else {
        console.log('Robot user not found for update.');
        return false;
      }
    } catch (error) {
      console.error('Error updating robot user data:', error);
      return false;
    }
  }
}
