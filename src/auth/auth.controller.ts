import { AuthHelpers } from './helpers/auth-helpers';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { RegisterByEmailDto, LoginByEmailDto } from './dto';
import { AuthGuard } from './guard/auth.guard';
import { ReqType } from 'src/telegram/types/types';

@ApiTags('Auth By Email')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authHelpers: AuthHelpers,
  ) {}

  @Post('email/register')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() data: RegisterByEmailDto) {
    return this.authService.signUp(data);
  }

  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() data: LoginByEmailDto) {
    return this.authService.signIn(data);
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  logout(@Req() req: ReqType) {
    this.authService.logout(req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Get('refresh')
  refreshTokens(@Req() req: ReqType) {
    const userId = req.user.userId;
    const refreshToken = req.user['refreshToken'];
    return this.authHelpers.refreshTokens(userId, refreshToken);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Request() req: ReqType) {
    console.log({ request: req.user });
    return await this.authService.me(req.user.email);
  }
}
