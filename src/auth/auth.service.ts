import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginByEmailDto, RegisterByEmailDto } from './dto';
import { AuthHelpers } from './helpers/auth-helpers';
import { UserMapper } from 'src/user/mappers/user.mapper';
import { globalResponse } from 'src/utils/globalResponse';
import { ResponseCode, ResponseMessage } from 'src/types/globalEnums';
import { GlobalResponseType } from 'src/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly helpers: AuthHelpers,
  ) {}

  async signUp(regData: RegisterByEmailDto): Promise<GlobalResponseType> {
    // Check if user exists
    const userExists = await this.usersService.findByEmail(regData.email);
    if (userExists) {
      // throw new BadRequestException('User already exists');
      return globalResponse({
        retCode: ResponseCode.CONFLICT,
        regMsg: ResponseMessage.ERROR,
        result: {},
        retExtInfo: 'User already exists',
      });
    }

    // Hash password
    const hash = await this.helpers.hashData(regData.password);
    const newUserData = UserMapper.createUserToDomain({
      ...regData,
      password: hash,
    });
    const newUser = await this.usersService.create(newUserData);
    const tokens = await this.helpers.getTokens(newUser.id, newUser.email);
    await this.helpers.updateRefreshToken(newUser.id, tokens.refreshToken);

    return globalResponse({
      retCode: ResponseCode.CREATED,
      regMsg: ResponseMessage.OK,
      result: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        userData: this.helpers.toUserDomainSafeUser(newUser),
      },
      retExtInfo: '',
    });
  }

  async signIn(data: LoginByEmailDto): Promise<GlobalResponseType> {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) {
      return globalResponse({
        retCode: ResponseCode.BAD_REQUEST,
        regMsg: ResponseMessage.ERROR,
        result: {},
        retExtInfo: 'User does not exist',
      });
    }
    const passwordMatches = await this.helpers.verifyHash(
      user.password,
      data.password,
    );
    if (!passwordMatches) {
      // throw new BadRequestException('Password is incorrect')
      return globalResponse({
        retCode: ResponseCode.BAD_REQUEST,
        regMsg: ResponseMessage.ERROR,
        result: {},
        retExtInfo: 'Email or Password is incorrect',
      });
    }
    const tokens = await this.helpers.getTokens(user.id, user.email);
    await this.helpers.updateRefreshToken(user.id, tokens.refreshToken);
    return globalResponse({
      retCode: ResponseCode.ACCEPTED,
      regMsg: ResponseMessage.OK,
      result: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        userData: this.helpers.toUserDomainSafeUser(user),
      },
      retExtInfo: '',
    });
  }

  async me(email: string) {
    const userData = await this.usersService.findByEmail(email);
    if (!userData)
      return globalResponse({
        retCode: ResponseCode.CONFLICT,
        regMsg: ResponseMessage.ERROR,
        result: {},
        retExtInfo: 'User does not exist',
      });

    return globalResponse({
      retCode: ResponseCode.ACCEPTED,
      regMsg: ResponseMessage.OK,
      result: { userData },
      retExtInfo: '',
    });
  }

  async logout(userId: string) {
    const userData = await this.usersService.update(userId, {
      refreshToken: null,
    });
    if (!userData)
      return globalResponse({
        retCode: ResponseCode.INTERNAL_SERVER_ERROR,
        regMsg: ResponseMessage.ERROR,
        result: {},
        retExtInfo: 'Internal server error',
      });

    return globalResponse({
      retCode: ResponseCode.ACCEPTED,
      regMsg: ResponseMessage.OK,
      result: {},
      retExtInfo: '',
    });
  }
}
