import { Injectable } from '@nestjs/common';
import { RestClientV5 } from 'bybit-api';
import { PrismaService } from 'src/prisma/prisma.service';
import { GlobalResponseType, ResponseCode, ResponseMessage } from 'src/types';
import { globalResponse } from 'src/utils/globalResponse';

@Injectable()
export class BybitService {
  public client: RestClientV5;
  constructor(private readonly prisma: PrismaService) {}

  async initClient(userId: string): Promise<GlobalResponseType> {
    const user = await this.prisma.userExchanges.findFirst({
      where: { userId, exchangeId: 'bybit' },
    });

    if (!user) {
      return globalResponse({
        retCode: ResponseCode.BAD_REQUEST,
        regMsg: ResponseMessage.ERROR,
        result: { client: null },
        retExtInfo: 'Connect to bybit first',
      });
    }

    const client = new RestClientV5({
      key: user.apiKey,
      secret: user.apiSecret,
    });
    this.client = client;
    return globalResponse({
      retCode: ResponseCode.ACCEPTED,
      regMsg: ResponseMessage.OK,
      result: { client },
      retExtInfo: '',
    });
  }

  getClient() {
    return this.client;
  }
}
