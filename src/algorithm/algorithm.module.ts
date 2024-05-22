import { Module } from '@nestjs/common';
import { AlgorithmService } from './algorithm.service';
import { AlgorithmController } from './algorithm.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AlgorithmController],
  providers: [AlgorithmService, PrismaService],
  exports: [AlgorithmService],
})
export class AlgorithmModule {}
