import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findByEmail(email: string) {
    return (await this.prisma.users.findFirst({
      where: { email },
    })) as User;
  }

  async findById(id: UserEntity['id']) {
    return this.prisma.users.findFirst({
      where: { id },
    });
  }

  async update(id: string, payload: Partial<User>): Promise<User> {
    // Find the user entity by ID using Prisma
    const entity = await this.prisma.users.findUnique({
      where: { id },
    });

    // If the entity is not found, throw a NotFoundException
    if (!entity) {
      throw new NotFoundException('User not found');
    }

    // Update the entity with the provided payload using Prisma
    const updatedEntity = await this.prisma.users.update({
      where: { id },
      data: payload,
    });

    // Return the updated entity
    return updatedEntity as User;
  }
}
