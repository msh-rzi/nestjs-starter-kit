import { Injectable } from '@nestjs/common';
// services, mappers and helpers
import { BybitService } from './../shared/bybit.service';
import { ExchangeBybitHelper } from '../helpers/exchange.bybit.helper';
import { ExchangeBybitMapper } from '../mappers/exchange.bybit.mapper';
// stuff
import { globalResponse } from 'src/utils/globalResponse';
// types
import { ResponseCode, ResponseMessage } from 'src/types/globalEnums';
import { TradeDetails } from 'src/telegram/types/types';
import { BybitOrderDomain } from '../domain/bybit.order.domain';
import { GlobalResponseType } from 'src/types/globalTypes';

@Injectable()
export class ExchangeBybitRepository {
  constructor(
    private readonly service: BybitService,
    private readonly helper: ExchangeBybitHelper,
  ) {}

  async getAccountBalance(
    userId: string,
    specificCoin?: string,
  ): Promise<GlobalResponseType> {
    const client = this.service.getClient(userId);
    console.log({ client });
    const balance = await client.getWalletBalance({
      accountType: 'UNIFIED',
      ...(specificCoin && { coin: specificCoin }),
    });

    return globalResponse({
      retCode: ResponseCode.OK,
      regMsg: ResponseMessage.OK,
      result: {
        balance: balance.result.list,
      },
      retExtInfo: '',
    });
  }

  async getActiveOrders(
    userId: string,
    settleCoin?: string,
  ): Promise<GlobalResponseType> {
    const client = this.service.getClient(userId);
    const activeOrders = await client.getActiveOrders({
      category: 'linear',
      // settleCoin: settleCoin || 'USDT',
      symbol: settleCoin,
      openOnly: 0,
      // orderStatus: 'Active',
    });
    return globalResponse({
      retCode: ResponseCode.OK,
      regMsg: ResponseMessage.OK,
      result: { activeOrders: activeOrders.result.list },
      retExtInfo: '',
    });
  }

  async calculateQuantity(
    userId: string,
    lastAlgorithm: any,
    category: 'inverse' | 'linear',
    symbol: string,
    leverage: string,
  ): Promise<string> {
    console.log(`calculateQuantity called with parameters: 
      userId: ${userId}, 
      lastAlgorithm: ${JSON.stringify(lastAlgorithm)}, 
      category: ${category}, 
      symbol: ${symbol}, 
      leverage: ${leverage}`);

    const coinLastPrice = parseFloat(
      await this.helper.getCoinLastPrice(userId, category, symbol),
    );
    console.log(`coinLastPrice: ${coinLastPrice}`);

    const isPercentage = lastAlgorithm.purchaseType === 'percent';
    console.log(`isPercentage: ${isPercentage}`);

    const accountBalanceReq = await this.getAccountBalance(userId, 'USDT');
    console.log(`accountBalanceReq: ${JSON.stringify(accountBalanceReq)}`);

    const accountBalance = parseFloat(
      accountBalanceReq.result.balance.at(0).coin.at(0)
        .availableToWithdraw as string,
    );
    console.log(`accountBalance: ${accountBalance}`);

    const lastAlgorithmPurchaseVolume = parseFloat(
      lastAlgorithm.purchaseVolume,
    );
    console.log(`lastAlgorithmPurchaseVolume: ${lastAlgorithmPurchaseVolume}`);

    const floatLeverage = parseFloat(leverage);
    console.log(`floatLeverage: ${floatLeverage}`);

    const effectiveBalance = accountBalance * floatLeverage;
    console.log(`effectiveBalance: ${effectiveBalance}`);

    const result = isPercentage
      ? (
          (effectiveBalance * (lastAlgorithmPurchaseVolume / 100)) /
          coinLastPrice
        ).toString()
      : (lastAlgorithmPurchaseVolume * coinLastPrice).toString();

    console.log(`calculated result: ${result}`);
    return Math.round(parseFloat(result)).toString();
  }

  async createOrder(userId: string, exchangeId: string, data: TradeDetails) {
    const { Symbol, Leverage } = data;

    console.log('Updating position config:', { Symbol, Leverage });
    await this.helper.updatePositionConfig(userId, Symbol, Leverage);

    console.log('Fetching user algorithms:', { userId, exchangeId });
    const userAlgorithms = await this.helper.getUserAlgorithms(
      userId,
      exchangeId,
    );
    const lastAlgorithm = userAlgorithms.at(0);
    console.log('Last algorithm:', lastAlgorithm);

    console.log('Calculating quantity:', {
      lastAlgorithm,
      type: 'linear',
      Symbol,
      Leverage,
    });
    const qty = await this.calculateQuantity(
      userId,
      lastAlgorithm,
      'linear',
      Symbol,
      Leverage,
    );
    console.log('Calculated quantity:', qty);

    console.log('Mapping to order domain:', { data, qty });
    const orders = ExchangeBybitMapper.toOrderDomain(data, qty);
    console.log('Orders:', orders);

    // console.log('Mapping to trading stop domain:', { data, qty });
    // const stopTradings = ExchangeBybitMapper.toTradingStopDomain(data, qty);
    // console.log('Stop tradings:', stopTradings);

    const client = this.service.getClient(userId);

    console.log('Submitting batch orders:', { orders });
    const ordersReq = await client.batchSubmitOrders('linear', orders);
    console.log({ ordersReq });
    console.log({ ordersReqResult: (ordersReq.result as any).list });
    console.log({ retExtInfo: ((ordersReq as any).retExtInfo as any).list });

    // if (isBatch) {
    // } else {
    //   console.log('Submitting single order:', { order: orders.at(0) });
    //   const orderReq = await client.submitOrder(
    //     orders.at(0) as BybitOrderDomain,
    //   );
    //   console.log({ orderReq });
    // }

    // stopTradings.forEach(async (st, index) => {
    //   console.log('Setting trading stop:', { stopTrading: st, index });
    //   const stopTradingReq = await client.setTradingStop(st);
    //   const clgKey = `stopTradingReq-${index}`;
    //   console.log({ [clgKey]: stopTradingReq });
    // });
  }
}
