import { Injectable } from '@nestjs/common';
import { RestClientV5 } from 'bybit-api';
import { BybitService } from '../shared/bybit.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TradeDetails } from 'src/telegram/types/types';

@Injectable()
export class ExchangeBybitHelper {
  private client: RestClientV5;
  constructor(
    private readonly bybitService: BybitService,
    private readonly prisma: PrismaService,
  ) {
    this.client = this.bybitService.getClient();
  }

  async getPositionInfo(category: BybitOrderCategory, symbol: string) {
    const getPositionInfo = await this.client.getPositionInfo({
      category,
      symbol,
    });

    return getPositionInfo;
  }

  async getUserAlgorithms(usersId: string, exchangeId: string) {
    return await this.prisma.algorithm.findMany({
      where: { usersId, exchangeId },
      orderBy: { id: 'desc' },
    });
  }

  async switchPositionMode(category: 'inverse' | 'linear', symbol: string) {
    const switchHedgeMode = await this.client.switchPositionMode({
      category,
      symbol,
      mode: 0,
    });
    console.log({ switchHedgeMode });
  }

  async updateLeverage(
    category: 'inverse' | 'linear',
    symbol: string,
    leverage: string,
  ) {
    const setLeverage = await this.client.setLeverage({
      category,
      symbol,
      buyLeverage: leverage,
      sellLeverage: leverage,
    });
    console.log({ setLeverage });
  }

  async getCoinLastPrice(category: 'inverse' | 'linear', symbol: string) {
    const tickers = await this.client.getTickers({ category, symbol });
    return tickers.result.list.at(0).lastPrice;
  }

  async updatePositionConfig(symbol: string, leverage: string) {
    const category = 'linear';

    const targetCoinPositionInfo = await this.getPositionInfo(category, symbol);
    if (targetCoinPositionInfo.retCode !== 0) {
      return {
        message: 'error getPositionInfo',
      };
    }

    // update leverage
    if (
      targetCoinPositionInfo.result.list.at(0).leverage !== leverage.toString()
    ) {
      const setLeverage = await this.updateLeverage(
        category,
        symbol,
        leverage.toString(),
      );
      console.log({ setLeverage });
    }

    // update position mode
    if (targetCoinPositionInfo.result.list[0].positionIdx !== 0) {
      const switchHedgeMode = await this.switchPositionMode(category, symbol);
      console.log({ switchHedgeMode });
    }
  }
}
