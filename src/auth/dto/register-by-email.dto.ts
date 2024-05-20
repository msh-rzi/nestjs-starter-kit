import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterByEmailDto {
  @ApiProperty({ example: 'mehdi.rezaei879@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'Mehdi' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Rezaei' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  refreshToken: string;
}
