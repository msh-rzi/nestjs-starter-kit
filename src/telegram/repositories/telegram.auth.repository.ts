import { Injectable } from '@nestjs/common';
// stuff
import { globalResponse } from 'src/utils/globalResponse';
// telegram
import { StringSession } from 'telegram/sessions';
import { TelegramClient } from 'telegram';
// services
import { TelegramHelpers } from '../helpers/telegram.helpers';
import { PrismaService } from 'src/prisma/prisma.service';
// types
import { ResponseCode, ResponseMessage } from 'src/types/globalEnums';
import { GlobalResponseType } from 'src/types/globalTypes';
import { initTelegramClientParams } from '../types/types';

@Injectable()
export class TelegramAuthRepository {
  public client: TelegramClient;
  public phoneNumber: string;

  constructor(
    private readonly helpers: TelegramHelpers,
    private readonly prisma: PrismaService,
  ) {}

  checkConnection() {
    return globalResponse({
      retCode: ResponseCode.OK,
      regMsg: ResponseMessage.OK,
      result: { isConnect: this.client.connected },
      retExtInfo: '',
    });
  }

  async initTelegramClient({
    session,
  }: initTelegramClientParams): Promise<TelegramClient> {
    const isUserConnected = this.checkConnection();
    if (isUserConnected.result.isConnect) return this.client;

    const stringSession = new StringSession(session || '');
    const { apiHash, apiId } = this.helpers.getApiCredentials();
    const client = new TelegramClient(stringSession, apiId, apiHash, {
      testServers: true,
      connectionRetries: 5,
      retryDelay: 1000,
    });
    this.client = client;
    await client.connect();

    return client;
  }

  async sendCode(phoneNumber?: string): Promise<GlobalResponseType> {
    try {
      const client = await this.initTelegramClient({});

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
    const telegramUserInfo = await this.client.signInUser(
      { apiId, apiHash },
      {
        phoneNumber: this.phoneNumber,
        phoneCode: async () => phoneCode,
        onError: (err) => {
          console.log(err);
        },
      },
    );

    console.log(telegramUserInfo);
    // If sign-in is successful, access user information
    if (telegramUserInfo) {
      // Access username
      const username = (telegramUserInfo as any).username;
      console.log('Username:', username);

      // Download user profile photo
      const profilePhotoBuffer = await this.client.downloadProfilePhoto(
        telegramUserInfo.id,
      );
      const profilePhoto = Buffer.from(profilePhotoBuffer).toString('base64');
      const session = JSON.parse(JSON.stringify(this.client.session.save()));
      console.log({ session });

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
            usersId: userId,
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
      const client = await this.initTelegramClient({ session });
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
