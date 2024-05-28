import { Injectable } from '@nestjs/common';
import { RestClientV5 } from 'bybit-api';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseCode, ResponseMessage } from 'src/types/globalEnums';
import { GlobalResponseType } from 'src/types/globalTypes';
import { globalResponse } from 'src/utils/globalResponse';

@Injectable()
export class BybitService {
  private clients: Map<string, RestClientV5> = new Map();

  constructor(private readonly prisma: PrismaService) {
    // !! delete me
    this.prisma.userExchanges.findMany().then((res) => {
      console.log({ res });
      res.forEach(async (u) => {
        if (u.exchangeId === 'bybit') {
          await this.initBybitClient(u.userId);
        }
      });
    });
  }

  async initBybitClient(userId: string): Promise<GlobalResponseType> {
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
    this.clients.set(userId, client);
    return globalResponse({
      retCode: ResponseCode.ACCEPTED,
      regMsg: ResponseMessage.OK,
      result: { client },
      retExtInfo: '',
    });
  }

  getClient(userId: string): RestClientV5 | null {
    console.log(this.clients);
    return this.clients.get(userId) || null;
  }
}
