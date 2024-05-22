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
import { AlgorithmService } from './algorithm.service';
import { ApiTags } from '@nestjs/swagger';
import { AddAlgorithmDto } from './dto/add-algorithm-dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ReqType } from 'src/telegram/types/types';

@ApiTags('algorithm')
@Controller({
  path: 'algorithm',
  version: '1',
})
export class AlgorithmController {
  constructor(private readonly algorithmService: AlgorithmService) {}

  @UseGuards(AuthGuard)
  @Post('add-algorithm')
  @HttpCode(HttpStatus.OK)
  async addAlgorithm(@Req() req: ReqType, @Body() dto: AddAlgorithmDto) {
    const usersId = req.user.userId;
    return await this.algorithmService.addAlgorithm(dto, usersId);
  }

  @UseGuards(AuthGuard)
  @Get('get-user-algorithms')
  @HttpCode(HttpStatus.OK)
  async getUserAlgorithms(@Req() req: ReqType) {
    const usersId = req.user.userId;
    return await this.algorithmService.getUserAlgorithms(usersId);
  }

  @UseGuards(AuthGuard)
  @Post('get-user-algorithms-by-telegram-channel-id')
  @HttpCode(HttpStatus.OK)
  async getUserAlgorithmsByExchangeId(
    @Req() req: ReqType,
    @Body() dto: { channelId: string },
  ) {
    const usersId = req.user.userId;
    return await this.algorithmService.getUserAlgorithmsByTelegramChannelId(
      usersId,
      dto.channelId,
    );
  }
}
