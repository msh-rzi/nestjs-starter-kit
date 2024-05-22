import { Injectable } from '@nestjs/common';
// services, mappers and helpers
import { BybitService } from './../shared/bybit.service';
import { ExchangeBybitHelper } from '../helpers/exchange.bybit.helper';
import { ExchangeBybitMapper } from '../mappers/exchange.bybit.mapper';
// bybit api
import { RestClientV5 } from 'bybit-api';
// stuff
import { globalResponse } from 'src/utils/globalResponse';
// types
import { GlobalResponseType, ResponseCode, ResponseMessage } from 'src/types';
import { TradeDetails } from 'src/telegram/types/types';
import { BybitOrderDomain } from '../domain/bybit.order.domain';

@Injectable()
export class ExchangeBybitRepository {
  private client: RestClientV5;
  constructor(
    private readonly service: BybitService,
    private readonly helper: ExchangeBybitHelper,
  ) {
    this.client = this.service.getClient();
  }

  async getAccountBalance(specificCoin?: string): Promise<GlobalResponseType> {
    const balance = await this.client.getWalletBalance({
      accountType: 'UNIFIED',
      ...(specificCoin && { coin: specificCoin }),
    });

    if (specificCoin) {
      return globalResponse({
        retCode: ResponseCode.OK,
        regMsg: ResponseMessage.OK,
        result: {
          balance:
            balance.result.list?.at?.(0)?.coin?.at?.(0)?.availableToWithdraw ||
            '0',
        },
        retExtInfo: '',
      });
    } else {
      return globalResponse({
        retCode: ResponseCode.OK,
        regMsg: ResponseMessage.OK,
        result: {
          balance: balance.result.list,
        },
        retExtInfo: '',
      });
    }
  }

  async getActiveOrders(settleCoin?: string): Promise<GlobalResponseType> {
    const activeOrders = await this.client.getActiveOrders({
      category: 'linear',
      settleCoin: settleCoin || 'USDT',
      openOnly: 0,
    });
    return globalResponse({
      retCode: ResponseCode.OK,
      regMsg: ResponseMessage.OK,
      result: { activeOrders },
      retExtInfo: '',
    });
  }

  async calculateQuantity(
    lastAlgorithm: any,
    category: 'inverse' | 'linear',
    symbol: string,
    leverage: string,
  ): Promise<string> {
    const coinLastPrice = parseFloat(
      await this.helper.getCoinLastPrice(category, symbol),
    );

    const isPercentage = lastAlgorithm.purchaseType === 'percent';
    const accountBalanceReq = await this.getAccountBalance('USDT');
    const accountBalance = parseFloat(
      accountBalanceReq.result.balance as string,
    );

    const lastAlgorithmPurchaseVolume = parseFloat(
      lastAlgorithm.purchaseVolume,
    );
    const floatLeverage = parseFloat(leverage);
    const effectiveBalance = accountBalance * floatLeverage;

    return isPercentage
      ? (
          (effectiveBalance * (lastAlgorithmPurchaseVolume / 100)) /
          coinLastPrice
        ).toString()
      : (lastAlgorithmPurchaseVolume * coinLastPrice).toString();
  }
  async createOrder(userId: string, exchangeId: string, data: TradeDetails) {
    const { Symbol, Leverage } = data;

    console.log('Updating position config:', { Symbol, Leverage });
    await this.helper.updatePositionConfig(Symbol, Leverage);

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
      lastAlgorithm,
      'linear',
      Symbol,
      Leverage,
    );
    console.log('Calculated quantity:', qty);

    const isBatch = data.EntryTargets.length > 1;
    console.log('Is batch order:', isBatch);

    console.log('Mapping to order domain:', { data, qty, isBatch });
    const orders = ExchangeBybitMapper.toOrderDomain(data, qty, isBatch);
    console.log('Orders:', orders);

    console.log('Mapping to trading stop domain:', { data, qty });
    const stopTradings = ExchangeBybitMapper.toTradingStopDomain(data, qty);
    console.log('Stop tradings:', stopTradings);

    if (isBatch) {
      console.log('Submitting batch orders:', { orders });
      const ordersReq = await this.client.batchSubmitOrders('linear', orders);
      console.log({ ordersReq });
    } else {
      console.log('Submitting single order:', { order: orders.at(0) });
      const orderReq = await this.client.submitOrder(
        orders.at(0) as BybitOrderDomain,
      );
      console.log({ orderReq });
    }

    stopTradings.forEach(async (st, index) => {
      console.log('Setting trading stop:', { stopTrading: st, index });
      const stopTradingReq = await this.client.setTradingStop(st);
      const clgKey = `stopTradingReq-${index}`;
      console.log({ [clgKey]: stopTradingReq });
    });
  }
}
