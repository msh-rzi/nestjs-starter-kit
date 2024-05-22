import { TradeDetails } from 'src/telegram/types/types';

export const extractTradeDetailFromGPTResponse = (rawMessage: string) => {
  const regex = /copixStart\d+(.*?)copixEnd\d+/gs;
  const matches = rawMessage.match(regex);

  console.log({ matches });

  if (!matches) {
    return [];
  }

  const objects: TradeDetails[] = matches.map((match) => {
    const objStr = match.replace(/(copixStart\d+)|(copixEnd\d+)/g, '').trim();
    console.log({ objStr });
    return JSON.parse(objStr) as TradeDetails;
  });

  return objects;
};
