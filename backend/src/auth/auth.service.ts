import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { sendOTPEmail } from './sendOTPEmail';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (
      !user ||
      user.hash !== crypto.createHash('md5').update(password).digest('hex')
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const otp = this.generateOtp();
    const otp_expire_at = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.user.update({
      where: { email },
      data: { otp, otp_expire_at },
    });

    await sendOTPEmail(email, otp);

    return { user_id: user.id, require_otp: true };
  }

  async verifyOTP(user_id: number, otp: string) {
    const user = await this.prisma.user.findUnique({ where: { id: user_id } });

    if (!user || !user.otp_expire_at) {
      throw new UnauthorizedException();
    }

    if (user.otp !== otp || user.otp_expire_at < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    await this.prisma.user.update({
      where: { id: user_id },
      data: { otp: null, otp_expire_at: null },
    });

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

  async getAuth(name: string, password: string) {
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
