import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(name: string, email: string, password: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      throw new ForbiddenException('user already exists');
    }

    if (password.length < 8 || !/^[a-zA-Z0-9]+$/.test(password)) {
      throw new ForbiddenException('password is invalid');
    }

    const hash = createHash('md5').update(password).digest('hex');

    const record = {
      name: name,
      email: email,
      hash: hash,
    };

    const user = await this.prisma.user.create({
      data: record,
    });

    return {
      success: true,
      message: 'user is created',
      user: {
        id: user.id,
        name: user.name,
      },
    };
  }

  async getUser(token: string, id: number) {
    const now = new Date();

    const auth = await this.prisma.auth.findFirst({
      where: {
        token,
        expire_at: {
          gt: now,
        },
      },
    });

    if (!auth) {
      throw new ForbiddenException();
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async updateUser(
    token: string,
    data: {
      name: string;
      email: string;
      password: string;
    },
  ) {
    const now = new Date();

    const auth = await this.prisma.auth.findFirst({
      where: {
        token,
        expire_at: {
          gt: now,
        },
      },
    });

    if (!auth) {
      throw new ForbiddenException();
    }

    const hash = crypto.createHash('md5').update(data.password).digest('hex');

    const updated = await this.prisma.user.update({
      where: {
        id: auth.user_id,
      },
      data: {
        name: data.name,
        email: data.email,
        hash: hash,
        updated_at: new Date(),
      },
    });

    return {
      message: 'ユーザー情報を更新しました',
      user: {
        name: updated.name,
        email: updated.email,
      },
    };
  }
}
