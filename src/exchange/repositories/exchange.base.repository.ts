import { Injectable } from '@nestjs/common';
// dto
import { AddExchangeDto } from '../dto/add-exchange.dto';
// service
import { PrismaService } from 'src/prisma/prisma.service';
// stuff
import { globalResponse } from 'src/utils/globalResponse';
// types
import { ResponseCode, ResponseMessage } from 'src/types/globalEnums';
import { GlobalResponseType } from 'src/types/globalTypes';

@Injectable()
export class ExchangeBaseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addExchange(dto: AddExchangeDto): Promise<GlobalResponseType> {
    try {
      await this.prisma.exchange.create({
        data: dto,
      });
      return globalResponse({
        retCode: ResponseCode.CREATED,
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

  async getExchangeById(exchangeId: string): Promise<GlobalResponseType> {
    try {
      console.log('here');
      const exchange = await this.prisma.exchange.findUnique({
        where: { id: exchangeId },
      });

      if (!exchange) {
        return globalResponse({
          retCode: ResponseCode.BAD_REQUEST,
          regMsg: ResponseMessage.ERROR,
          result: {},
          retExtInfo: 'Exchange does not exist',
        });
      }

      return globalResponse({
        retCode: ResponseCode.CREATED,
        regMsg: ResponseMessage.OK,
        result: { exchange },
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

  async getAllExchanges(): Promise<GlobalResponseType> {
    try {
      const exchanges = await this.prisma.exchange.findMany({
        select: {
          id: true,
          name: true,
          image: true,
        },
      });
      console.log({ exchanges });
      return globalResponse({
        retCode: ResponseCode.OK,
        regMsg: ResponseMessage.OK,
        result: { exchanges },
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

  async addUserExchange(
    userId: string,
    apiKey: string,
    apiSecret: string,
    exchangeId: string,
  ): Promise<GlobalResponseType> {
    const targetExchangeData = await this.getExchangeById(exchangeId);
    console.log('first');
    if (!targetExchangeData.result.exchange.id) {
      return globalResponse({
        retCode: ResponseCode.BAD_REQUEST,
        regMsg: ResponseMessage.ERROR,
        result: {},
        retExtInfo: 'Exchange does not exist',
      });
    }

    await this.prisma.userExchanges.create({
      data: {
        exchangeId,
        name: targetExchangeData.result.exchange.name,
        apiKey,
        apiSecret,
        userId,
      },
    });
    return globalResponse({
      retCode: ResponseCode.CREATED,
      regMsg: ResponseMessage.OK,
      result: {},
      retExtInfo: '',
    });
  }

  async userExchange(userId: string) {
    try {
      const exchanges = await this.prisma.userExchanges.findMany({
        where: { userId },
        select: {
          exchangeId: true,
        },
      });
      return globalResponse({
        retCode: ResponseCode.ACCEPTED,
        regMsg: ResponseMessage.OK,
        result: { exchanges },
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
