import { IsNotEmpty, IsString } from 'class-validator';

export class AddUserExchangeDto {
  @IsNotEmpty()
  @IsString()
  apiKey: string;

  @IsNotEmpty()
  @IsString()
  apiSecret: string;

  @IsNotEmpty()
  @IsString()
  exchangeId: string;
}
