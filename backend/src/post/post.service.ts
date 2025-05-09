import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(message: string, token: string) {
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
      throw new ForbiddenException();
    }

    const record = {
      user_id: auth.user_id,
      content: message,
    };

    await this.prisma.microPost.create({ data: record });
  }

  async getList(token: string, start: number, nr_records: number) {
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
      throw new ForbiddenException();
    }

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
          },
        },
      },
    });

    const records = qb.map((post) => ({
      id: post.id,
      content: post.content,
      user_name: post.user.name,
      created_at: post.created_at,
    }));

    console.log(records);

    return records;
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
      throw new ForbiddenException();
    }

    const count = await this.prisma.microPost.count({
      where: {
        user_id: auth.user_id,
      },
    });

    return count;
    console.log('count', count);
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
      throw new ForbiddenException();
    }

    const post = await this.prisma.microPost.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    });

    if (!post || post.user_id !== auth.user_id) {
      throw new ForbiddenException(
        'You are not authorized to delete this post',
      );
    }

    return await this.prisma.microPost.delete({
      where: {
        id: parseInt(id, 10),
      },
    });
  }
}
