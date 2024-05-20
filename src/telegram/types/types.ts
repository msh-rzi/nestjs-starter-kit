export type GetApiCredentialsData = {
  apiId: number;
  apiHash: string;
};
export type initTelegramClientParams = {
  session?: string;
};
export type TradeDetails = {
  Symbol: string;
  Market: string;
  Position: string;
  Leverage: string;
  EntryTargets: number[]; // Assuming EntryTargets is an array of numbers
  TakeProfitTargets: number[]; // Assuming TakeProfitTargets is an array of numbers
  StopLoss: number | null; // Assuming StopLoss can be a number or null
};

export type ReqType = { user: { userId: string } };
