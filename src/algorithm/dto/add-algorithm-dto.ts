import { IsString, IsNotEmpty } from 'class-validator';

export class AddAlgorithmDto {
  @IsNotEmpty()
  @IsString()
  algorithmName: string;

  @IsNotEmpty()
  @IsString()
  exchangeId: string;

  @IsNotEmpty()
  @IsString()
  algorithm: string;

  @IsNotEmpty()
  @IsString()
  channelId: string;

  @IsNotEmpty()
  @IsString()
  purchaseVolume: string;

  @IsNotEmpty()
  @IsString()
  purchaseType: string;
}
