export type GetApiCredentialsData = {
  apiId: number;
  apiHash: string;
};
export type initTelegramClientParams = {
  session?: string;
};

export class TradeDetails {
  Symbol: string;
  Market: string;
  Position: string;
  Leverage: string;
  EntryTargets: number[];
  TakeProfitTargets: number[];
  StopLoss: number | null;
}

export type ReqType = { user: { userId: string } };
