import { Injectable } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import {
  AuthenticationException,
  DatabaseException,
} from 'src/common/exceptions/app.exception';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(message: string, token: string) {
    const now = new Date();
    const auth = await this.prisma.auth.findFirst({
      where: {
        token: token,
        expire_at: {
          gte: now,
        },
      },
    });

    if (!auth) {
      throw new AuthenticationException(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    const record = {
      user_id: auth.user_id,
      content: message,
    };

    try {
      await this.prisma.microPost.create({ data: record });
    } catch (error) {
      throw new DatabaseException(
        ERROR_MESSAGES.DATABASE.POST.CREATION_FAILED,
        error,
      );
    }
  }

  async getList(token: string, start: number, nr_records: number) {
    const now = new Date();

    const auth = await this.prisma.auth.findFirst({
      where: {
        token: token,
        expire_at: {
          gte: now,
        },
      },
    });

    if (!auth) {
      throw new AuthenticationException(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    try {
      const qb = await this.prisma.microPost.findMany({
        skip: start,
        take: nr_records,
        orderBy: {
          created_at: 'desc',
        },
        include: {
          user: {
            select: {
              name: true,
              avatar_url: true,
            },
          },
        },
      });

      return qb.map((post) => ({
        id: post.id,
        user_id: post.user_id,
        content: post.content,
        user_name: post.user.name,
        avatar_url: post.user.avatar_url,
        created_at: post.created_at,
      }));
    } catch (error) {
      throw new DatabaseException(
        ERROR_MESSAGES.DATABASE.POST.FETCH_FAILED,
        error,
      );
    }
  }

  async getSearchList(token: string, search: string) {
    const now = new Date();

    const auth = await this.prisma.auth.findUnique({
      where: {
        token: token,
        expire_at: {
          gte: now,
        },
      },
    });

    if (!auth) {
      throw new AuthenticationException(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    try {
      const qb = await this.prisma.microPost.findMany({
        where: {
          content: {
            contains: search,
            mode: 'insensitive',
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        include: {
          user: {
            select: {
              name: true,
              avatar_url: true,
            },
          },
        },
      });

      return qb.map((post) => ({
        id: post.id,
        user_id: post.user_id,
        content: post.content,
        user_name: post.user.name,
        avatar_url: post.user.avatar_url,
        created_at: post.created_at,
      }));
    } catch (error) {
      throw new DatabaseException(
        ERROR_MESSAGES.DATABASE.POST.FETCH_FAILED,
        error,
      );
    }
  }

  async getPostCount(token: string) {
    const now = new Date();

    const auth = await this.prisma.auth.findUnique({
      where: {
        token: token,
        expire_at: {
          gte: now,
        },
      },
    });

    if (!auth) {
      throw new AuthenticationException(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    const count = await this.prisma.microPost.count();

    return count;
  }

  async deletePost(id: string, token: string) {
    const now = new Date();

    const auth = await this.prisma.auth.findUnique({
      where: {
        token: token,
        expire_at: {
          gte: now,
        },
      },
    });

    if (!auth) {
      throw new AuthenticationException(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    try {
      return await this.prisma.microPost.delete({
        where: {
          id: parseInt(id, 10),
        },
      });
    } catch (error) {
      throw new DatabaseException(
        ERROR_MESSAGES.DATABASE.POST.DELETE_FAILED,
        error,
      );
    }
  }
}
