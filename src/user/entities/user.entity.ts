export class UserEntity {
  id?: string;
  email: string;
  password?: string;
  previousPassword?: string;
  provider: 'email' | 'google' | 'facebook';
  socialId?: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
  role?: 'client' | 'admin';
  status?: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  refreshToken: string | null;
}
