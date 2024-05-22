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
import { TradeDetails } from 'src/telegram/types/types';
import { GlobalResponseType } from 'src/types/globalTypes';
import { AddExchangeDto } from './dto/add-exchange.dto';
import { ExchangeBaseRepository } from './repositories/exchange.base.repository';
import { ExchangeBybitRepository } from './repositories/exchange.bybit.repository';

@ApiTags('Exchanges')
@Controller({
  path: 'exchange',
  version: '1',
})
export class ExchangeController {
  constructor(
    private readonly exchangeBaseService: ExchangeBaseRepository,
    private readonly exchangeBybitService: ExchangeBybitRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  async addExchange(
    @Body() addExchangeDto: AddExchangeDto,
  ): Promise<GlobalResponseType> {
    return this.exchangeBaseService.addExchange(addExchangeDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getExchangeById(@Param('id') id: string): Promise<GlobalResponseType> {
    return this.exchangeBaseService.getExchangeById(id);
  }

  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllExchanges(): Promise<GlobalResponseType> {
    return this.exchangeBaseService.getAllExchanges();
  }

  @UseGuards(AuthGuard)
  @Post('user/:userId')
  @HttpCode(HttpStatus.CREATED)
  async addUserExchange(
    @Param('userId') userId: string,
    @Body()
    {
      apiKey,
      apiSecret,
      exchangeId,
    }: { apiKey: string; apiSecret: string; exchangeId: string },
  ): Promise<GlobalResponseType> {
    return this.exchangeBaseService.addUserExchange(
      userId,
      apiKey,
      apiSecret,
      exchangeId,
    );
  }

  @UseGuards(AuthGuard)
  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async getUserExchanges(
    @Param('userId') userId: string,
  ): Promise<GlobalResponseType> {
    return this.exchangeBaseService.userExchange(userId);
  }

  @UseGuards(AuthGuard)
  @Get('bybit/balance')
  @HttpCode(HttpStatus.OK)
  async getBybitBalance(@Req() req: any): Promise<GlobalResponseType> {
    const { specificCoin } = req.query;
    return this.exchangeBybitService.getAccountBalance(specificCoin);
  }

  @UseGuards(AuthGuard)
  @Get('bybit/orders')
  @HttpCode(HttpStatus.OK)
  async getBybitActiveOrders(@Req() req: any): Promise<GlobalResponseType> {
    const { settleCoin } = req.query;
    return this.exchangeBybitService.getActiveOrders(settleCoin);
  }

  @UseGuards(AuthGuard)
  @Post('bybit/order')
  @HttpCode(HttpStatus.CREATED)
  async createBybitOrder(
    @Body() tradeDetails: TradeDetails,
    @Req() req: any,
  ): Promise<void> {
    const { userId, exchangeId } = req.body;
    await this.exchangeBybitService.createOrder(
      userId,
      exchangeId,
      tradeDetails,
    );
  }
}
