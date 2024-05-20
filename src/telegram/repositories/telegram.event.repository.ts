import { Injectable } from '@nestjs/common';
// services
import { PrismaService } from 'src/prisma/prisma.service';
import { TelegramAuthRepository } from './telegram.auth.repository';
// telegram
import { NewMessage, NewMessageEvent } from 'telegram/events';
import { extractTradeDetails } from '../utils/extractTradeDetail';

@Injectable()
export class TelegramEventRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authRepo: TelegramAuthRepository,
  ) {}

  async startListening(usersId: string) {
    try {
      const session = await this.authRepo.getUserSession(usersId);
      const client = await this.authRepo.initTelegramClient({ session });

      const isUserHasData = await this.prisma.robots.findFirst({
        where: {
          name: 'Telegram Trade Automation',
          usersId,
        },
      });

      if (isUserHasData) {
        await this.prisma.robots.update({
          where: { id: isUserHasData.id },
          data: {
            startedAt: new Date(),
          },
        });
      } else {
        await this.prisma.robots.create({
          data: {
            name: 'Telegram Trade Automation',
            usersId,
          },
        });
      }

      const userExchanges = await this.prisma.userExchanges.findMany({
        where: {
          userId: usersId,
        },
      });

      if (!userExchanges.length) {
        console.log('not exchange');
        return { started: false };
      }

      // const userAlgorithms = await this.prisma.algorithm.findMany({
      //   where: {
      //     usersId,
      //   },
      //   orderBy: {
      //     id: 'desc',
      //   },
      // });

      // console.log({ userAlgorithms });
      // const lastAlgorithm = userAlgorithms[0];

      client.addEventHandler(async (event: NewMessageEvent) => {
        try {
          console.log('==================================');
          const message = event.message.message;
          console.log({ message });

          const extractedValues = extractTradeDetails(message);
          console.log({ extractedValues });
        } catch (error) {
          console.error('Error handling new message:', error);
        }
      }, new NewMessage({}));
      return { started: true };
    } catch (error) {
      console.log({ error });
      return { started: false };
    }
  }
}
