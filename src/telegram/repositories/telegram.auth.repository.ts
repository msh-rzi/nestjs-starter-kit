import { Injectable } from '@nestjs/common';
// stuff
import { globalResponse } from 'src/utils/globalResponse';
// telegram
import { StringSession } from 'telegram/sessions';
import { Api, TelegramClient } from 'telegram';
// services
import { TelegramHelpers } from '../helpers/telegram.helpers';
import { PrismaService } from 'src/prisma/prisma.service';
// types
import { ResponseCode, ResponseMessage } from 'src/types/globalEnums';
import { GlobalResponseType } from 'src/types/globalTypes';

@Injectable()
export class TelegramAuthRepository {
  public client: TelegramClient;
  private clients: Map<string, TelegramClient> = new Map();
  public phoneNumber: string;

  constructor(
    private readonly helpers: TelegramHelpers,
    private readonly prisma: PrismaService,
  ) {}

  async checkConnection(userId: string) {
    const userSession = await this.getUserSession(userId);
    if (!userSession) {
      return globalResponse({
        retCode: ResponseCode.OK,
        regMsg: ResponseMessage.OK,
        result: { isConnect: false },
        retExtInfo: '',
      });
    } else {
      await this.initTelegramClient(userId, userSession);
      return globalResponse({
        retCode: ResponseCode.OK,
        regMsg: ResponseMessage.OK,
        result: { isConnect: true },
        retExtInfo: '',
      });
    }
  }
  async initTelegramClient(
    userId: string,
    session?: string,
  ): Promise<TelegramClient> {
    try {
      console.log(`Initializing Telegram Client for user: ${userId}`);
      let client = this.clients.get(userId);

      if (client) {
        return new Promise((res) => {
          res(client);
        });
      }

      const stringSession = new StringSession(session || '');
      console.log('String session initialized:');

      const { apiHash, apiId } = this.helpers.getApiCredentials();
      console.log('API credentials retrieved:');

      client = new TelegramClient(stringSession, apiId, apiHash, {
        testServers: true,
        connectionRetries: 5,
        retryDelay: 1000,
      });
      console.log('Telegram client created');

      const connected = await client.connect();
      this.clients.set(userId, client);
      console.log('Client connection status:', connected);

      console.log('--------------------');
      console.log({ clients: this.clients });
      return client;
    } catch (error) {
      console.error(
        `Error initializing Telegram client for user ${userId}:`,
        error,
      );
      throw error;
    }
  }

  async sendCode(
    userId: string,
    phoneNumber: string,
  ): Promise<GlobalResponseType> {
    try {
      // const client = this.client;
      const client = await this.initTelegramClient(userId);

      const { apiHash, apiId } = this.helpers.getApiCredentials();
      const phone = phoneNumber;
      this.phoneNumber = phone;
      const isCodeSended = await client.sendCode({ apiId, apiHash }, phone);

      return globalResponse({
        retCode: ResponseCode.OK,
        regMsg: ResponseMessage.OK,
        result: { ...isCodeSended },
        retExtInfo: '',
      });
    } catch (error) {
      console.log(error);

      return globalResponse({
        retCode: ResponseCode.INTERNAL_SERVER_ERROR,
        regMsg: ResponseMessage.ERROR,
        result: { error },
        retExtInfo: 'Internal server error',
      });
    }
  }

  async signIn(phoneCode: string, userId: string) {
    const { apiHash, apiId } = this.helpers.getApiCredentials();
    const client = this.clients.get(userId);
    const telegramUserInfo = await client.signInUser(
      { apiId, apiHash },
      {
        phoneNumber: this.phoneNumber,
        phoneCode: async () => phoneCode,
        onError: (err) => {
          console.log(err);
        },
      },
    );

    // console.log(telegramUserInfo);
    // If sign-in is successful, access user information
    if (telegramUserInfo) {
      // Access username
      const username = (telegramUserInfo as any).username;
      console.log('Username:', username);

      // Download user profile photo
      const profilePhotoBuffer = await client.downloadProfilePhoto(
        telegramUserInfo.id,
      );
      const profilePhoto = Buffer.from(profilePhotoBuffer).toString('base64');
      const session = JSON.parse(JSON.stringify(client.session.save()));
      client.session.delete();
      // console.log({ session });

      // !! Save User to UserTelegram
      const user = await this.prisma.userTelegram.findFirst({
        where: { usersId: userId },
      });

      if (user) {
        await this.prisma.userTelegram.update({
          where: { id: user.id },
          data: { session },
        });
      } else {
        await this.prisma.userTelegram.create({
          data: {
            telegramId: BigInt(telegramUserInfo.id as any),
            profilePhoto,
            session,
            username,
            user: { connect: { id: userId } },
          },
        });
      }

      const firstName = (telegramUserInfo as any).firstName;
      const lastName = (telegramUserInfo as any).lastName;

      const fullname =
        (firstName ? firstName : '') + (lastName ? ' ' + lastName : '');

      return globalResponse({
        retCode: ResponseCode.OK,
        regMsg: ResponseMessage.OK,
        result: {
          fullName: fullname,
          username,
          profilePhoto,
        },
        retExtInfo: '',
      });
    } else {
      console.log('Sign-in failed');
      return globalResponse({
        retCode: ResponseCode.BAD_REQUEST,
        regMsg: ResponseMessage.ERROR,
        result: {},
        retExtInfo: 'Sign-in failed',
      });
    }
  }

  async getUserSession(usersId: string) {
    const userData = await this.prisma.userTelegram.findFirst({
      where: { usersId },
    });

    return userData?.session || '';
  }

  async getMe(userId: string) {
    try {
      const session = await this.getUserSession(userId);
      const client = await this.initTelegramClient(userId, session);
      const me = await client.getMe();
      //   await this.startListening(userId);
      const profilePhotoBuffer = await client.downloadProfilePhoto(me.id);
      const profilePhoto = Buffer.from(profilePhotoBuffer).toString('base64');

      const firstName = (me as any).firstName;
      const lastName = (me as any).lastName;

      const fullname =
        (firstName ? firstName : '') + (lastName ? ' ' + lastName : '');

      return {
        fullname,
        username: me.username,
        profilePhoto,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
