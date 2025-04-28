import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async getAuth(name: string, password: string) {
    console.log('AuthService getAuth called');

    if (!password) {
      throw new UnauthorizedException();
    }

    const hash = crypto.createHash('md5').update(password).digest('hex');
    const user = await this.prisma.user.findUnique({
      where: {
        name,
        hash,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const ret = {
      token: '',
      user_id: user.id,
    };

    var expire = new Date();
    expire.setDate(expire.getDate() + 1);

    const auth = await this.prisma.auth.findFirst({
      where: {
        user_id: user.id,
      },
    });

    if (auth) {
      const updated = await this.prisma.auth.update({
        where: {
          id: auth.id,
        },
        data: {
          expire_at: expire,
        },
      });
      ret.token = updated.token;
    } else {
      const token = crypto.randomUUID();
      const created = await this.prisma.auth.create({
        data: {
          user_id: user.id,
          token,
          expire_at: expire,
        },
      });
      ret.token = created.token;
    }

    return ret;
  }
}
