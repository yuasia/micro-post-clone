import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return await this.authService.login(body.email, body.password);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { user_id: number; otp: string }) {
    return await this.authService.verifyOTP(body.user_id, body.otp);
  }

  @Get()
  async getAuth(
    @Query('user_id') name: string,
    @Query('password') password: string,
  ) {
    return await this.authService.getAuth(name, password);
  }
}
