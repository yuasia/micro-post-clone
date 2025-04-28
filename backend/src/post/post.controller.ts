import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(
    @Body('message') message: string,
    @Query('token') token: string,
  ) {
    return await this.postService.createPost(message, token);
  }

  @Get()
  async getList(
    @Query('token') token: string,
    @Query('start') start: string,
    @Query('records') nr_records: string,
  ) {
    const numRecords = parseInt(nr_records, 10);
    const startIndex = parseInt(start, 10);
    return await this.postService.getList(token, startIndex, numRecords);
  }
}
