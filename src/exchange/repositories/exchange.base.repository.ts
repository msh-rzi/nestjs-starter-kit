import { Injectable } from '@nestjs/common';
import { AddExchangeDto } from '../dto/add-exchange.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { globalResponse } from 'src/utils/globalResponse';
import { GlobalResponseType, ResponseCode, ResponseMessage } from 'src/types';

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

  async addUserExchange(
    userId: string,
    apiKey: string,
    apiSecret: string,
    exchangeId: string,
  ): Promise<GlobalResponseType> {
    const targetExchangeData = await this.getExchangeById(exchangeId);
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
}
