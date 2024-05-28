import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ReqType, TradeDetails } from 'src/telegram/types/types';
import { GlobalResponseType } from 'src/types/globalTypes';
import { AddExchangeDto } from './dto/add-exchange.dto';
import { ExchangeBaseRepository } from './repositories/exchange.base.repository';
import { AddUserExchangeDto } from './dto/add-user-exchange.dto';
import { ExchangeBybitRepository } from './repositories/exchange.bybit.repository';

@ApiTags('Exchanges')
@Controller({
  path: 'exchange',
  version: '1',
})
export class ExchangeController {
  constructor(
    private readonly exchangeBaseService: ExchangeBaseRepository,
    private readonly bybitRepo: ExchangeBybitRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Post('add-exchange')
  @HttpCode(HttpStatus.CREATED)
  async addExchange(
    @Body() addExchangeDto: AddExchangeDto,
  ): Promise<GlobalResponseType> {
    return this.exchangeBaseService.addExchange(addExchangeDto);
  }

  @UseGuards(AuthGuard)
  @Get('all-exchanges')
  @HttpCode(HttpStatus.OK)
  async getAllExchanges(): Promise<GlobalResponseType> {
    console.log('first');
    return await this.exchangeBaseService.getAllExchanges();
  }

  @UseGuards(AuthGuard)
  @Post('add-user-exchange')
  @HttpCode(HttpStatus.CREATED)
  async addUserExchange(
    @Req() req: ReqType,
    @Body()
    { apiKey, apiSecret, exchangeId }: AddUserExchangeDto,
  ): Promise<GlobalResponseType> {
    const userId = req.user.userId;
    return this.exchangeBaseService.addUserExchange(
      userId,
      apiKey,
      apiSecret,
      exchangeId,
    );
  }

  @UseGuards(AuthGuard)
  @Get('user-exchanges')
  @HttpCode(HttpStatus.OK)
  async getUserExchanges(@Req() req: ReqType): Promise<GlobalResponseType> {
    const userId = req.user.userId;
    return this.exchangeBaseService.userExchange(userId);
  }

  @UseGuards(AuthGuard)
  @Post('bybit-balance')
  @HttpCode(HttpStatus.OK)
  async getAccountBalance(
    @Req() req: ReqType,
    @Body() dto: { specificCoin?: string },
  ) {
    const userId = req.user.userId;
    return this.bybitRepo.getAccountBalance(userId, dto.specificCoin);
  }

  @UseGuards(AuthGuard)
  @Post('bybit-active-orders')
  @HttpCode(HttpStatus.OK)
  async getActiveOrders(
    @Req() req: ReqType,
    @Body() dto: { settleCoin?: string },
  ) {
    const userId = req.user.userId;
    return this.bybitRepo.getActiveOrders(userId, dto.settleCoin);
  }

  @UseGuards(AuthGuard)
  @Post('bybit-create-order')
  @HttpCode(HttpStatus.OK)
  async createOrder(
    @Req() req: ReqType,
    @Body() dto: { exchangeId?: string; data: TradeDetails },
  ) {
    const userId = req.user.userId;
    return this.bybitRepo.createOrder(userId, dto.exchangeId, dto.data);
  }
}
