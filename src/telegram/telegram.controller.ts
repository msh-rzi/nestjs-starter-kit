import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// services
import { TelegramAuthRepository } from './repositories/telegram.auth.repository';
import { TelegramChannelsRepository } from './repositories/telegram.channel.repository';
import { TelegramEventRepository } from './repositories/telegram.event.repository';
// auth guard
import { AuthGuard } from 'src/auth/guard/auth.guard';
// types
import { ReqType } from './types/types';
// dto
import { ChannelHistoryDto, SendCodeDto, SignInDto } from './dto';

@ApiTags('Telegram Bots')
@Controller({
  path: 'telegram',
  version: '1',
})
export class TelegramController {
  constructor(
    private readonly evnRepo: TelegramEventRepository,
    private readonly authRepo: TelegramAuthRepository,
    private readonly channelsRepo: TelegramChannelsRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Get('init-connection')
  @HttpCode(HttpStatus.OK)
  async initClient() {
    return await this.authRepo.initTelegramClient({});
  }

  @UseGuards(AuthGuard)
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() dto: SendCodeDto) {
    return await this.authRepo.sendCode(dto.phoneNumber);
  }

  @UseGuards(AuthGuard)
  @Post('signIn')
  @HttpCode(HttpStatus.OK)
  async createClient(@Req() req: ReqType, @Body() dto: SignInDto) {
    const userId = req.user.userId;
    return await this.authRepo.signIn(dto.phoneCode, userId);
  }

  @UseGuards(AuthGuard)
  @Get('check-connection')
  @HttpCode(HttpStatus.OK)
  async checkConnection() {
    return this.authRepo.checkConnection();
  }

  @UseGuards(AuthGuard)
  @Get('get-me')
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() req: ReqType) {
    const userId = req.user.userId;
    return await this.authRepo.getMe(userId);
  }

  @UseGuards(AuthGuard)
  @Post('channel-history')
  @HttpCode(HttpStatus.OK)
  async channelHistory(@Req() req: ReqType, @Body() dto: ChannelHistoryDto) {
    const userId = req.user.userId;
    return await this.channelsRepo.channelHistory(userId, dto.channelId);
  }

  @UseGuards(AuthGuard)
  @Get('channels')
  @HttpCode(HttpStatus.OK)
  async channels(@Req() req: ReqType) {
    const userId = req.user.userId;
    return await this.channelsRepo.channels(userId);
  }

  @UseGuards(AuthGuard)
  @Get('start-listening')
  @HttpCode(HttpStatus.OK)
  async startListening(@Req() req: ReqType) {
    const userId = req.user.userId;
    const starting = await this.evnRepo.startListening(userId);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(starting);
      }, 5000);
    });
  }
}
