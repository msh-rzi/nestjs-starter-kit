import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChannelHistoryDto {
  @ApiProperty({ example: '12345' })
  @IsNotEmpty()
  channelId: BigInt;
}
