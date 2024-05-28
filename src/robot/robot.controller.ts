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
import { RobotBaseRepository } from './repositories/robot.base.repository';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ReqType } from 'src/telegram/types/types';

@ApiTags('Robot')
@Controller({
  path: 'robot',
  version: '1',
})
export class RobotController {
  constructor(private readonly service: RobotBaseRepository) {}

  @UseGuards(AuthGuard)
  @Post('add-robot')
  @HttpCode(HttpStatus.OK)
  async addRobot(
    @Body() dto: { name: string; description: string; path: string },
  ) {
    return await this.service.addRobot(dto.name, dto.description, dto.path);
  }

  @UseGuards(AuthGuard)
  @Get('all-robots')
  @HttpCode(HttpStatus.OK)
  async getRobots() {
    return await this.service.getRobots();
  }

  @UseGuards(AuthGuard)
  @Get('user-robots')
  @HttpCode(HttpStatus.OK)
  async getUserRobots(@Req() req: ReqType) {
    const userId = req.user.userId;
    return await this.service.getUserRobots(userId);
  }
}
