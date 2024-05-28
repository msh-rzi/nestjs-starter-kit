import { TradeDetails } from 'src/telegram/types/types';
import { BybitBatchOrderDomain } from '../domain/bybit.order.domain';
import { BybitTradingStopDomain } from '../domain/bybit.trading.stop.domain';

export class ExchangeBybitMapper {
  static toOrderDomain(
    raw: TradeDetails,
    qty: string,
  ): BybitBatchOrderDomain[] {
    return this.toBatchOrderDomain(raw, qty);
  }

  static toBatchOrderDomain(
    raw: TradeDetails,
    qty: string,
  ): BybitBatchOrderDomain[] {
    const orderList: BybitBatchOrderDomain[] = [];

    const side = raw.Position.toLowerCase() === 'short' ? 'Sell' : 'Buy';
    const dividedQty = Math.round(+qty / raw.EntryTargets.length);

    raw.EntryTargets.forEach((et) => {
      raw.TakeProfitTargets.forEach((tp) => {
        const eachTpQty = Math.round(dividedQty / raw.TakeProfitTargets.length);
        const order = new BybitBatchOrderDomain();
        order.symbol = raw.Symbol.replace('.p', '').toUpperCase();
        order.side = side;
        order.orderType = 'Limit';
        order.qty = eachTpQty.toString();
        order.price = et.toString();
        order.timeInForce = 'GTC';
        order.orderLinkId = null;
        order.isLeverage = 1;
        order.orderFilter = 'Order';
        order.positionIdx = side === 'Buy' ? 1 : 2;
        order.tpslMode = 'Partial';
        order.takeProfit = tp.toString();
        order.stopLoss = raw.StopLoss.toString();

        orderList.push(order);
      });
    });

    return orderList;
  }

  static toTradingStopDomain(raw: TradeDetails, qty: string) {
    const stopTradingList: BybitTradingStopDomain[] = [];

    const side = raw.Position.toLowerCase() === 'short' ? 'Sell' : 'Buy';
    raw.TakeProfitTargets.forEach((tp) => {
      const stopTrading = new BybitTradingStopDomain();
      stopTrading.category = 'linear';
      stopTrading.symbol = raw.Symbol.replace('.p', '').toUpperCase();
      stopTrading.takeProfit = tp.toString();
      stopTrading.stopLoss = raw.StopLoss.toString();
      stopTrading.tpSize = '50';
      stopTrading.slSize = '50';
      stopTrading.tpTriggerBy = 'MarkPrice';
      stopTrading.slTriggerBy = 'IndexPrice';
      // stopTrading.tpSize = `${Math.round(parseFloat(qty)) * 0.5}`;
      // stopTrading.slSize = `${Math.round(parseFloat(qty)) * 0.5}`;
      stopTrading.tpslMode = 'Partial';
      stopTrading.tpOrderType = 'Limit';
      stopTrading.slOrderType = 'Limit';
      stopTrading.positionIdx = side === 'Buy' ? 1 : 2;
      stopTrading.activePrice = null;
      stopTrading.trailingStop = null;
      stopTrading.tpLimitPrice = 'Limit';
      stopTrading.slLimitPrice = 'Limit';

      stopTradingList.push(stopTrading);
    });

    return stopTradingList;
  }
}
