import { TradeDetails } from 'src/telegram/types/types';
import {
  BybitBatchOrderDomain,
  BybitOrderDomain,
} from '../domain/bybit.order.domain';
import { BybitTradingStopDomain } from '../domain/bybit.trading.stop.domain';

export class ExchangeBybitMapper {
  static toOrderDomain(
    raw: TradeDetails,
    qty: string,
    isBatch: boolean,
  ): BybitOrderDomain[] | BybitBatchOrderDomain[] {
    if (isBatch) return this.toBatchOrderDomain(raw, qty);
    else return this.toSingleOrderDomain(raw, qty);
  }

  static toSingleOrderDomain(
    raw: TradeDetails,
    qty: string,
  ): BybitOrderDomain[] {
    const orderList: BybitOrderDomain[] = [];

    raw.EntryTargets.forEach((et) => {
      const order = new BybitOrderDomain();
      order.category = 'linear';
      order.symbol = raw.Symbol.replace('.p', '').toUpperCase();
      order.side = raw.Position.toLowerCase() === 'short' ? 'Sell' : 'Buy';
      order.orderType = 'Limit';
      order.qty = qty;
      order.price = et.toString();
      order.timeInForce = 'GTC';
      order.orderLinkId = null;
      order.isLeverage = 1;
      order.orderFilter = 'Order';
      order.positionIdx = 0;
      order.tpslMode = 'Full';
      order.takeProfit = null;
      order.stopLoss = null;

      orderList.push(order);
    });

    return orderList;
  }

  static toBatchOrderDomain(
    raw: TradeDetails,
    qty: string,
  ): BybitBatchOrderDomain[] {
    const orderList: BybitBatchOrderDomain[] = [];

    raw.EntryTargets.forEach((et) => {
      const order = new BybitBatchOrderDomain();
      order.symbol = raw.Symbol.replace('.p', '').toUpperCase();
      order.side = raw.Position.toLowerCase() === 'short' ? 'Sell' : 'Buy';
      order.orderType = 'Limit';
      order.qty = qty;
      order.price = et.toString();
      order.timeInForce = 'GTC';
      order.orderLinkId = null;
      order.isLeverage = 1;
      order.orderFilter = 'Order';
      order.positionIdx = 0;
      order.tpslMode = 'Full';
      order.takeProfit = null;
      order.stopLoss = null;

      orderList.push(order);
    });

    return orderList;
  }

  static toTradingStopDomain(raw: TradeDetails, qty: string) {
    const stopTradingList: BybitTradingStopDomain[] = [];

    raw.TakeProfitTargets.forEach((tp) => {
      const stopTrading = new BybitTradingStopDomain();
      stopTrading.category = 'linear';
      stopTrading.symbol = raw.Symbol.replace('.p', '').toUpperCase();
      stopTrading.takeProfit = tp.toString();
      stopTrading.stopLoss = raw.StopLoss.toString();
      stopTrading.tpSize = `${Math.round(parseFloat(qty)) * 0.5}`;
      stopTrading.slSize = `${Math.round(parseFloat(qty)) * 0.5}`;
      stopTrading.tpslMode = 'Partial';
      stopTrading.positionIdx = 0;
      stopTrading.tpTriggerBy = 'MarkPrice';
      stopTrading.slTriggerBy = 'MarkPrice';
      stopTrading.activePrice = null;
      stopTrading.trailingStop = null;
      stopTrading.tpLimitPrice = null;
      stopTrading.slLimitPrice = null;
      stopTrading.tpOrderType = null;
      stopTrading.slOrderType = null;

      stopTradingList.push(stopTrading);
    });

    return stopTradingList;
  }
}
