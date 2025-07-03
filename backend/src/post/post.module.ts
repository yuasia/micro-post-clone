import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthHelperService } from 'src/common/services/auth-helper.service';

@Module({
  controllers: [PostController],
  providers: [PostService, PrismaService, AuthHelperService],
})
export class PostModule {}
