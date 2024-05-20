import { User } from '../domain/user';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    const user = new User();
    user.id = raw.id;
    user.email = raw.email;
    user.password = raw.password;
    user.previousPassword = raw.previousPassword;
    user.provider = raw.provider;
    user.socialId = raw.socialId;
    user.firstName = raw.firstName;
    user.lastName = raw.lastName;
    if (raw.photo) {
      user.photo = raw.photo;
    }
    user.role = raw.role;
    user.status = raw.status;
    user.createdAt = raw.createdAt;
    user.updatedAt = raw.updatedAt;
    user.deletedAt = raw.deletedAt;
    return user;
  }

  static createUserToDomain(raw: CreateUserDto): User {
    const user = new User();
    user.email = raw.email;
    user.password = raw.password;
    user.firstName = raw.firstName;
    user.lastName = raw.lastName;
    user.role = 'admin';
    return user;
  }

  static toPersistence(user: User): UserEntity {
    let role: 'client' | 'admin' | undefined = user?.role ?? 'client';

    let photo: string | undefined | null = undefined;

    if (user.photo) {
      photo = user.photo;
    } else if (user.photo === null) {
      photo = null;
    }

    let status: 'active' | 'inactive' | undefined = user?.status ?? 'active';

    const userEntity = new UserEntity();
    if (user.id && typeof user.id === 'number') {
      userEntity.id = user.id;
    }
    userEntity.email = user.email;
    userEntity.password = user.password;
    userEntity.previousPassword = user.previousPassword;
    userEntity.provider = user?.provider ?? 'email';
    userEntity.socialId = user.socialId;
    userEntity.firstName = user.firstName;
    userEntity.lastName = user.lastName;
    userEntity.photo = photo;
    userEntity.role = role;
    userEntity.status = status;
    userEntity.createdAt = user.createdAt;
    userEntity.updatedAt = user.updatedAt;
    userEntity.deletedAt = user.deletedAt;
    return userEntity;
  }
}
