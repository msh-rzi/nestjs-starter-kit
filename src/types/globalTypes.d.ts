import { ResponseCode, ResponseMessage } from './globalEnums';

declare type GlobalResponseType<T = any> = {
  retCode: ResponseCode;
  regMsg: ResponseMessage;
  result: T;
  retExtInfo: any;
  time: number;
};
