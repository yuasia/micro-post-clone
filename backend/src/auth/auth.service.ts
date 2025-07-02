import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { sendOTPEmail } from '../nodemailer/sendOTPEmail';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { sendResetPasswordEmail } from 'src/nodemailer/sendResetPasswordEmail';
import {
  AuthenticationException,
  DatabaseException,
  ExternalServiceException,
  ValidationException,
} from 'src/common/exceptions/app.exception';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';

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
      throw new AuthenticationException(
        ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
      );
    }

    const otp = this.generateOtp();
    const otp_expire_at = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.user.update({
      where: { email },
      data: { otp, otp_expire_at },
    });

    try {
      await sendOTPEmail(email, otp);
    } catch (error) {
      await this.prisma.user.update({
        where: { email },
        data: { otp: null, otp_expire_at: null },
      });
      throw new ExternalServiceException(ERROR_MESSAGES.AUTH.EMAIL_SEND_FAILED);
    }

    return { user_id: user.id, require_otp: true };
  }

  async verifyOTP(user_id: number, otp: string) {
    const user = await this.prisma.user.findUnique({ where: { id: user_id } });

    if (!user || !user.otp_expire_at) {
      throw new AuthenticationException(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    if (user.otp !== otp) {
      throw new ValidationException(ERROR_MESSAGES.AUTH.INVALID_OTP);
    }

    if (user.otp_expire_at < new Date()) {
      throw new ValidationException(ERROR_MESSAGES.AUTH.OTP_EXPIRED);
    }

    try {
      await this.prisma.user.update({
        where: { id: user_id },
        data: { otp: null, otp_expire_at: null },
      });
    } catch (error) {
      throw new DatabaseException(ERROR_MESSAGES.DATABASE.USER.UPDATE_FAILED);
    }

    const ret = {
      token: '',
      user_id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
    };

    var expire = new Date();
    expire.setDate(expire.getDate() + 1);

    const auth = await this.prisma.auth.findFirst({
      where: {
        user_id: user.id,
      },
    });

    if (!auth) {
      throw new AuthenticationException(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

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
      const payload = { sub: user.id.toString(), type: 'auth' };
      const token = this.jwtService.sign(payload, {
        expiresIn: '1d',
      });
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

  async requestReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new AuthenticationException(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    const expire_at = new Date(Date.now() + 1000 * 60 * 10);

    const jwtPayload = {
      sub: user.id.toString(),
      email: user.email,
      type: 'password_reset',
      exp: Math.floor(expire_at.getTime() / 1000),
    };

    const token = this.jwtService.sign(jwtPayload);

    try {
      await this.prisma.passwordReset.deleteMany({
        where: { user_id: user.id },
      });
    } catch (error) {
      throw new DatabaseException(
        ERROR_MESSAGES.DATABASE.PASSWORD.DELETE_FAILED,
      );
    }

    try {
      await this.prisma.passwordReset.create({
        data: {
          user_id: user.id,
          token: token,
          expire_at: expire_at,
        },
      });
    } catch (error) {
      throw new DatabaseException(
        ERROR_MESSAGES.DATABASE.PASSWORD.CREATION_FAILED,
      );
    }

    try {
      await sendResetPasswordEmail(email, token);
    } catch (error) {
      await this.prisma.passwordReset.deleteMany({
        where: { user_id: user.id },
      });
      throw new ExternalServiceException(
        ERROR_MESSAGES.AUTH.RESET_EMAIL_SEND_FAILED,
      );
    }
  }

  async resetPassword(token: string, password: string) {
    const payload = this.jwtService.verify(token);

    if (payload.type !== 'password_reset') {
      throw new ValidationException(ERROR_MESSAGES.AUTH.INVALID_TOKEN_TYPE);
    }

    const record = await this.prisma.passwordReset.findUnique({
      where: { token: token },
    });

    if (!record || record.expire_at < new Date()) {
      throw new ValidationException(ERROR_MESSAGES.AUTH.INVALID_TOKEN);
    }

    const hash = crypto.createHash('md5').update(password).digest('hex');

    try {
      await this.prisma.user.update({
        where: { id: record.user_id },
        data: { hash: hash },
      });
    } catch (error) {
      throw new DatabaseException(ERROR_MESSAGES.DATABASE.USER.UPDATE_FAILED);
    }

    try {
      await this.prisma.passwordReset.delete({
        where: { token: token },
      });
    } catch (error) {
      throw new DatabaseException(
        ERROR_MESSAGES.DATABASE.PASSWORD.DELETE_FAILED,
      );
    }

    return { message: 'Password reset successfully' };
  }
}
