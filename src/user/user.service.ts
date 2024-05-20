import { Injectable } from '@nestjs/common';
import { User } from './domain/user';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserMapper } from './mappers/user.mapper';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: User) {
    const newEntity = (await this.prisma.users.create({
      data: UserMapper.toPersistence(data),
    })) as UserEntity;

    return UserMapper.toDomain(newEntity);
  }
}
