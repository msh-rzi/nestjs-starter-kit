import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendCodeDto {
  @ApiProperty({ example: '+98 876 543 2112' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
