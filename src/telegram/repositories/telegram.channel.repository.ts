import { Injectable } from '@nestjs/common';
// services
import { TelegramAuthRepository } from './telegram.auth.repository';
// stuff
import { globalResponse } from 'src/utils/globalResponse';
// types
import { GlobalResponseType } from 'src/types/globalTypes';
import { ResponseCode, ResponseMessage } from 'src/types/globalEnums';
// telegram
import { Api } from 'telegram';

@Injectable()
export class TelegramChannelsRepository {
  constructor(private readonly AuthRepo: TelegramAuthRepository) {}

  async channels(userId: string): Promise<GlobalResponseType> {
    try {
      const session = await this.AuthRepo.getUserSession(userId);
      const client = await this.AuthRepo.initTelegramClient({ session });

      const dialogs = await client.getDialogs();

      // Filter only channels
      const channels = dialogs
        .map((dialog) => (dialog.isChannel ? dialog : null))
        .filter(Boolean);

      // Extract relevant information for each channel
      const extractedChannels = await Promise.all(
        channels.map(async (channel) => {
          // Get profile photo of the channel
          let profilePhotoBuffer = await client.downloadProfilePhoto(
            channel.entity,
          );

          return {
            id: channel.id,
            title: channel.title,
            username: (channel.entity as any)?.username || '',
            profilePhoto: Buffer.from(profilePhotoBuffer).toString('base64'),
          };
        }),
      );

      return globalResponse({
        retCode: ResponseCode.OK,
        regMsg: ResponseMessage.OK,
        result: { channels: extractedChannels },
        retExtInfo: '',
      });
    } catch (error) {
      console.error('Error getting user channels:', error);
      return globalResponse({
        retCode: ResponseCode.INTERNAL_SERVER_ERROR,
        regMsg: ResponseMessage.ERROR,
        result: { error },
        retExtInfo: 'Internal server error',
      });
    }
  }

  async channelHistory(
    userId: string,
    channelId: BigInt,
  ): Promise<GlobalResponseType> {
    try {
      const session = await this.AuthRepo.getUserSession(userId);
      const client = await this.AuthRepo.initTelegramClient({ session });

      const ch = await client.invoke(
        new Api.messages.GetHistory({
          // @ts-ignore
          peer: channelId,
          limit: 10,
        }),
      );
      const history = (ch as any).messages.map(
        (message: { id: any; message: any }, index: any) => ({
          id: index,
          messageId: message.id,
          message: message.message,
        }),
      );

      return globalResponse({
        retCode: ResponseCode.OK,
        regMsg: ResponseMessage.OK,
        result: { history },
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
}
