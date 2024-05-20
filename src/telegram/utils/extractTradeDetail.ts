import { TradeDetails } from '../types/types';

export function extractTradeDetails(message: string) {
  const tradeDetails: TradeDetails = {
    Symbol: '',
    Market: '',
    Position: '',
    Leverage: '',
    EntryTargets: [],
    TakeProfitTargets: [],
    StopLoss: null,
  };

  // Regular expressions to match the different parts of the message
  const symbolRegex = /Symbol:\s*#(\S+)/;
  const marketRegex = /Market:\s*(\S+)/;
  const positionRegex = /Position:\s*(\S+)/;
  const leverageRegex = /Leverage:\s*Isolated\s*(\d+x)/;
  const entryTargetsRegex = /Entry Targets:\s*((?:\d+\)\s*[\d.]+\s*)+)/;
  const takeProfitTargetsRegex =
    /Take-Profit Targets:\s*((?:\d+\)\s*[\d.]+\s*)+)/;
  const stopLossRegex = /StopLoss:\s*([\d.]+)/;

  // Extracting values using regex
  const symbolMatch = message.match(symbolRegex);
  if (symbolMatch)
    tradeDetails.Symbol = symbolMatch[1].replace('.p', '').toUpperCase();

  const marketMatch = message.match(marketRegex);
  if (marketMatch)
    tradeDetails.Market = marketMatch[1] === 'FUTURES' ? 'Buy' : 'Sell';

  const positionMatch = message.match(positionRegex);
  if (positionMatch) tradeDetails.Position = positionMatch[1];

  const leverageMatch = message.match(leverageRegex);
  if (leverageMatch) tradeDetails.Leverage = leverageMatch[1].replace('x', '');

  const entryTargetsMatch = message.match(entryTargetsRegex);
  if (entryTargetsMatch) {
    tradeDetails.EntryTargets = entryTargetsMatch[1]
      .match(/\d+\)\s*([\d.]+)/g)
      .map((target) => parseFloat(target.split(')')[1].trim()));
  }

  const takeProfitTargetsMatch = message.match(takeProfitTargetsRegex);
  if (takeProfitTargetsMatch) {
    tradeDetails.TakeProfitTargets = takeProfitTargetsMatch[1]
      .match(/\d+\)\s*([\d.]+)/g)
      .map((target) => parseFloat(target.split(')')[1].trim()));
  }

  const stopLossMatch = message.match(stopLossRegex);
  if (stopLossMatch) tradeDetails.StopLoss = parseFloat(stopLossMatch[1]);

  return tradeDetails;
}
