import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddAlgorithmDto } from './dto/add-algorithm-dto';
import { globalResponse } from 'src/utils/globalResponse';
import { ResponseCode, ResponseMessage } from 'src/types';

@Injectable()
export class AlgorithmService {
  constructor(private readonly prisma: PrismaService) {}
  async addAlgorithm(data: AddAlgorithmDto, usersId: string) {
    try {
      await this.prisma.algorithm.create({
        data: {
          ...data,
          usersId,
        },
      });
      return globalResponse({
        retCode: ResponseCode.ACCEPTED,
        regMsg: ResponseMessage.OK,
        result: {},
        retExtInfo: '',
      });
    } catch (error) {
      console.log(error);
      return globalResponse({
        retCode: ResponseCode.INTERNAL_SERVER_ERROR,
        regMsg: ResponseMessage.ERROR,
        result: { error },
        retExtInfo: 'Internal server error',
      });
    }
  }

  async getUserAlgorithms(usersId: string) {
    try {
      const userAlgorithms = await this.prisma.algorithm.findMany({
        where: { usersId },
      });
      return globalResponse({
        retCode: ResponseCode.ACCEPTED,
        regMsg: ResponseMessage.OK,
        result: { userAlgorithms },
        retExtInfo: '',
      });
    } catch (error) {
      console.log(error);
      return globalResponse({
        retCode: ResponseCode.INTERNAL_SERVER_ERROR,
        regMsg: ResponseMessage.ERROR,
        result: { error },
        retExtInfo: 'Internal server error',
      });
    }
  }

  async getUserAlgorithmsByExchangeId(usersId: string, exchangeId: string) {
    try {
      const userAlgorithms = await this.prisma.algorithm.findMany({
        where: {
          usersId,
          exchangeId,
        },
      });
      return globalResponse({
        retCode: ResponseCode.ACCEPTED,
        regMsg: ResponseMessage.OK,
        result: { userAlgorithms },
        retExtInfo: '',
      });
    } catch (error) {
      console.log(error);
      return globalResponse({
        retCode: ResponseCode.INTERNAL_SERVER_ERROR,
        regMsg: ResponseMessage.ERROR,
        result: { error },
        retExtInfo: 'Internal server error',
      });
    }
  }

  async getUserAlgorithmsByTelegramChannelId(
    usersId: string,
    channelId: string,
  ) {
    try {
      const userAlgorithms = await this.prisma.algorithm.findMany({
        where: {
          usersId,
          channelId,
        },
        select: {
          algorithm: true,
          algorithmName: true,
          channelId: true,
          exchangeId: true,
          purchaseType: true,
          purchaseVolume: true,
          id: true,
        },
      });
      return globalResponse({
        retCode: ResponseCode.ACCEPTED,
        regMsg: ResponseMessage.OK,
        result: { userAlgorithms },
        retExtInfo: '',
      });
    } catch (error) {
      console.log(error);
      return globalResponse({
        retCode: ResponseCode.INTERNAL_SERVER_ERROR,
        regMsg: ResponseMessage.ERROR,
        result: { error },
        retExtInfo: 'Internal server error',
      });
    }
  }
}
