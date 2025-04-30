import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    this.userService.createUser(name, email, password);
  }

  @Get(':id')
  async getUser(@Param('id') id: string, @Query('token') token: string) {
    const user_id = parseInt(id, 10);
    return await this.userService.getUser(token, user_id);
  }
}
