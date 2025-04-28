import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  createUser(name: string, email: string, password: string) {
    const hash = createHash('md5').update(password).digest('hex');

    const record = {
      name: name,
      email: email,
      hash: hash,
    };

    this.prisma.user.create({
      data: record,
    });
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
}
