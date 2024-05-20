import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: '12345' })
  @IsString()
  @IsNotEmpty()
  phoneCode: string;
}
