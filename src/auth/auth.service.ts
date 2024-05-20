import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginByEmailDto, RegisterByEmailDto } from './dto';
import { AuthHelpers } from './helpers/auth-helpers';
import { UserMapper } from 'src/user/mappers/user.mapper';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly authHelpers: AuthHelpers,
  ) {}

  async signUp(regData: RegisterByEmailDto): Promise<any> {
    // Check if user exists
    const userExists = await this.usersService.findByEmail(regData.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hash = await this.authHelpers.hashData(regData.password);
    const newUserData = UserMapper.createUserToDomain({
      ...regData,
      password: hash,
    });
    const newUser = await this.usersService.create(newUserData);
    const tokens = await this.authHelpers.getTokens(newUser.id, newUser.email);
    await this.authHelpers.updateRefreshToken(newUser.id, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userData: this.authHelpers.toUserDomainSafeUser(newUser),
    };
  }

  async signIn(data: LoginByEmailDto) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await this.authHelpers.verifyHash(
      user.password,
      data.password,
    );
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.authHelpers.getTokens(user.id, user.email);
    await this.authHelpers.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userData: this.authHelpers.toUserDomainSafeUser(user),
    };
  }

  async me(email: string) {
    return await this.usersService.findByEmail(email);
  }

  async logout(userId: number) {
    return this.usersService.update(userId, { refreshToken: null });
  }
}
