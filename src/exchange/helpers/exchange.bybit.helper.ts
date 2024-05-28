import { Injectable } from '@nestjs/common';
import { BybitService } from '../shared/bybit.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExchangeBybitHelper {
  constructor(
    private readonly bybitService: BybitService,
    private readonly prisma: PrismaService,
  ) {}

  async getPositionInfo(
    userId: string,
    category: BybitOrderCategory,
    symbol: string,
  ) {
    const client = this.bybitService.getClient(userId);
    const getPositionInfo = await client.getPositionInfo({
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

  async switchPositionMode(
    userId: string,
    category: 'inverse' | 'linear',
    symbol: string,
  ) {
    const client = this.bybitService.getClient(userId);
    const switchHedgeMode = await client.switchPositionMode({
      category,
      symbol,
      mode: 0,
    });
    console.log({ switchHedgeMode });
  }

  async updateLeverage(
    userId: string,
    category: 'inverse' | 'linear',
    symbol: string,
    leverage: string,
  ) {
    const client = this.bybitService.getClient(userId);
    const setLeverage = await client.setLeverage({
      category,
      symbol,
      buyLeverage: leverage,
      sellLeverage: leverage,
    });
    console.log({ setLeverage });
  }

  async getCoinLastPrice(
    userId: string,
    category: 'inverse' | 'linear',
    symbol: string,
  ) {
    const client = this.bybitService.getClient(userId);
    const tickers = await client.getTickers({ category, symbol });
    return tickers.result.list.at(0).lastPrice;
  }

  async updatePositionConfig(userId: string, symbol: string, leverage: string) {
    const category = 'linear';

    const targetCoinPositionInfo = await this.getPositionInfo(
      userId,
      category,
      symbol,
    );
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
        userId,
        category,
        symbol,
        leverage.toString(),
      );
      console.log({ setLeverage });
    }

    // update position mode
    if (targetCoinPositionInfo.result.list[0].positionIdx === 0) {
      const switchHedgeMode = await this.switchPositionMode(
        userId,
        category,
        symbol,
      );
      console.log({ switchHedgeMode });
    }
  }
}
