import { Injectable } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { DatabaseException } from 'src/common/exceptions/app.exception';
import { AuthHelperService } from 'src/common/services/auth-helper.service';
import { ResponseHelper } from 'src/common/services/response-helper.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostAPI } from 'src/types/api.types';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authHelper: AuthHelperService,
  ) {}

  async createPost(message: string, token: string) {
    const auth = await this.authHelper.validateTokenAndAuth(token);

    const record = {
      user_id: auth.user_id,
      content: message,
    };

    try {
      const res = await this.prisma.microPost.create({ data: record });
    } catch (error) {
      throw new DatabaseException(
        ERROR_MESSAGES.DATABASE.POST.CREATION_FAILED,
        error,
      );
    }
  }

  async getList(
    token: string,
    start: number,
    nr_records: number,
  ): Promise<PostAPI.GetListResponse> {
    const auth = await this.authHelper.validateTokenAndAuth(token);

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

      return ResponseHelper.success(
        qb.map((post) => ({
          id: post.id,
          user_id: post.user_id,
          content: post.content,
          user_name: post.user.name,
          avatar_url: post.user.avatar_url,
          created_at: post.created_at,
        })),
      ) as PostAPI.GetListResponse;
    } catch (error) {
      throw new DatabaseException(
        ERROR_MESSAGES.DATABASE.POST.FETCH_FAILED,
        error,
      );
    }
  }

  async getSearchList(
    token: string,
    search: string,
  ): Promise<PostAPI.GetListResponse> {
    const auth = await this.authHelper.validateTokenAndAuth(token);

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

      return ResponseHelper.success(
        qb.map((post) => ({
          id: post.id,
          user_id: post.user_id,
          content: post.content,
          user_name: post.user.name,
          avatar_url: post.user.avatar_url,
          created_at: post.created_at,
        })),
      ) as PostAPI.GetListResponse;
    } catch (error) {
      throw new DatabaseException(
        ERROR_MESSAGES.DATABASE.POST.FETCH_FAILED,
        error,
      );
    }
  }

  async getPostCount(token: string): Promise<number> {
    const auth = await this.authHelper.validateTokenAndAuth(token);

    const count = await this.prisma.microPost.count();

    return count;
  }

  async deletePost(id: string, token: string): Promise<PostAPI.DeleteResponse> {
    const auth = await this.authHelper.validateTokenAndAuth(token);

    try {
      const res = await this.prisma.microPost.delete({
        where: {
          id: parseInt(id, 10),
        },
      });

      return ResponseHelper.success({
        id: res.id,
      }) as PostAPI.DeleteResponse;
    } catch (error) {
      throw new DatabaseException(
        ERROR_MESSAGES.DATABASE.POST.DELETE_FAILED,
        error,
      );
    }
  }
}
