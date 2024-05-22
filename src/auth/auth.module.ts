import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthGuard } from './guard/auth.guard';
import { AuthHelpers } from './helpers/auth-helpers';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, AuthHelpers, UserService, JwtService],
  exports: [AuthService, AuthGuard, AuthHelpers],
})
export class AuthModule {}
