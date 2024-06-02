import { ResponseCode, ResponseMessage } from './globalEnums';

export type GlobalResponseType<T = any> = {
  retCode: ResponseCode;
  regMsg: ResponseMessage;
  result: T;
  retExtInfo: string;
  time?: number;
};
export type ReqType = { user: { userId: string; email: string } };