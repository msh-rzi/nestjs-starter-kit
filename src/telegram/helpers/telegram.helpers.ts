import { Injectable } from '@nestjs/common';
import { GetApiCredentialsData } from '../types/types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramHelpers {
  constructor(private readonly configService: ConfigService) {}

  getApiCredentials(): GetApiCredentialsData {
    const apiId = Number(this.configService.get<number>('TELEGRAM_API_ID'));
    const apiHash = this.configService.get<string>('TELEGRAM_API_HASH');
    return { apiId, apiHash };
  }
}
