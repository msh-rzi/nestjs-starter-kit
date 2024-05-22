export class BybitTradingStopDomain {
  category: 'linear' | 'inverse';
  symbol: string;
  takeProfit: string;
  stopLoss: string;
  tpSize?: string;
  slSize?: string;
  tpslMode: BybitOrderTpslMode;
  tpTriggerBy: BybitOrderTpTriggerBy;
  slTriggerBy: BybitOrderTpTriggerBy;
  trailingStop: null;
  activePrice: null;
  positionIdx: BybitPositionIdx;
  tpLimitPrice?: string;
  slLimitPrice?: string;
  tpOrderType: BybitOrderOrderType;
  slOrderType: BybitOrderOrderType;
}
