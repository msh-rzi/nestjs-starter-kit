import { Exclude } from 'class-transformer';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserMapper } from '../mappers/user.mapper';

export class User {
  id: number;
  email: string | null;
  @Exclude({ toPlainOnly: true })
  password?: string;
  @Exclude({ toPlainOnly: true })
  previousPassword?: string;
  provider: 'email' | 'google' | 'facebook';
  socialId?: string | null;
  firstName: string | null;
  lastName: string | null;
  photo?: string | null;
  role?: 'client' | 'admin';
  status?: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  refreshToken: string | null;
}
