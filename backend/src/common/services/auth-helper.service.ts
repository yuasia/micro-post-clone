import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthenticationException } from '../exceptions/app.exception';
import { ERROR_MESSAGES } from '../constants/error-messages';

@Injectable()
export class AuthHelperService {
  constructor(private readonly prisma: PrismaService) {}

  async validateTokenAndAuth(token: string) {
    const auth = await this.prisma.auth.findFirst({
      where: {
        token,
        expire_at: { gte: new Date() },
      },
    });

    if (!auth) {
      throw new AuthenticationException(ERROR_MESSAGES.AUTH.INVALID_TOKEN);
    }

    return auth;
  }
}
