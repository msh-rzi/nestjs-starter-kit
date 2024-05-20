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
import { JwtPayload } from './types/types';

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
  logout(@Req() req: any) {
    this.authService.logout(req.user['sub']);
  }

  @UseGuards(AuthGuard)
  @Get('refresh')
  refreshTokens(@Req() req: any) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authHelpers.refreshTokens(userId, refreshToken);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Request() request: { user: JwtPayload }) {
    console.log({ request: request.user });
    return {
      userData: await this.authService.me(request.user.email),
    };
  }
}
