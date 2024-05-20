import { Exclude } from 'class-transformer';

export class User {
  id: string;
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
