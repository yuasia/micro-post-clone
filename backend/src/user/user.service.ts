import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as crypto from 'crypto';
import { UpdateUserDto } from 'src/dto/user.dto';
import {
  AuthenticationException,
  DatabaseException,
  ValidationException,
} from 'src/common/exceptions/app.exception';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private validatePassword(password: string) {
    if (
      password.length < 6 ||
      password.length > 20 ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      throw new ValidationException(
        ERROR_MESSAGES.VALIDATION.INVALID_PASSWORD_FORMAT,
      );
    }
  }

  private validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationException(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL);
    }
  }

  async createUser(name: string, email: string, password: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      throw new AuthenticationException(
        ERROR_MESSAGES.AUTH.USER_ALREADY_EXISTS,
      );
    }

    this.validatePassword(password);

    const hash = createHash('md5').update(password).digest('hex');

    const record = {
      name: name,
      email: email,
      hash: hash,
    };

    try {
      const user = await this.prisma.user.create({
        data: record,
      });

      return {
        success: true,
        message: 'user is created',
        user: {
          id: user.id,
          name: user.name,
        },
      };
    } catch (error) {
      throw new DatabaseException(
        ERROR_MESSAGES.DATABASE.USER.CREATION_FAILED,
        error,
      );
    }
  }

  async getUser(token: string, id: number) {
    const now = new Date();

    const auth = await this.prisma.auth.findFirst({
      where: {
        token,
        expire_at: {
          gt: now,
        },
      },
    });

    if (!auth) {
      throw new AuthenticationException(ERROR_MESSAGES.AUTH.INVALID_TOKEN);
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new AuthenticationException(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    return user;
  }

  async updateUser(token: string, dto: UpdateUserDto) {
    const now = new Date();

    const auth = await this.prisma.auth.findFirst({
      where: {
        token,
        expire_at: {
          gt: now,
        },
      },
    });

    if (!auth) {
      throw new AuthenticationException(ERROR_MESSAGES.AUTH.INVALID_TOKEN);
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: auth.user_id,
      },
    });

    if (!user) {
      throw new AuthenticationException(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    const updateData: any = { updated_at: new Date() };

    if (dto.name) {
      updateData.name = dto.name;
    }
    if (dto.email) {
      this.validateEmail(dto.email);

      const exist = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
      if (exist) {
        throw new ValidationException(
          ERROR_MESSAGES.VALIDATION.EMAIL_ALREADY_EXISTS,
        );
      }
      updateData.email = dto.email;
    }
    if (dto.avatar_url) {
      updateData.avatar_url = dto.avatar_url;
    }
    if (dto.password) {
      if (!dto.currentPassword) {
        throw new ValidationException(
          ERROR_MESSAGES.VALIDATION.CURRENT_PASS_REQUIRED,
        );
      }

      this.validatePassword(dto.password);

      const currentHash = crypto
        .createHash('md5')
        .update(dto.currentPassword)
        .digest('hex');
      if (currentHash !== user.hash)
        throw new ValidationException(ERROR_MESSAGES.AUTH.INVALID_PASSWORD);
      updateData.hash = crypto
        .createHash('md5')
        .update(dto.password)
        .digest('hex');
    }

    try {
      const updated = await this.prisma.user.update({
        where: { id: auth.user_id },
        data: updateData,
      });

      return {
        user: {
          id: updated.id,
          name: updated.name,
          email: updated.email,
        },
      };
    } catch (error) {
      throw new DatabaseException(
        ERROR_MESSAGES.DATABASE.USER.UPDATE_FAILED,
        error,
      );
    }
  }

  async deleteUser(token: string, password: string) {
    const now = new Date();

    const auth = await this.prisma.auth.findFirst({
      where: {
        token,
        expire_at: {
          gt: now,
        },
      },
    });

    if (!auth) {
      throw new AuthenticationException(
        ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
      );
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: auth.user_id,
      },
    });

    if (!user) {
      throw new AuthenticationException(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    const hash = crypto.createHash('md5').update(password).digest('hex');

    this.validatePassword(password);

    if (hash !== user.hash) {
      throw new AuthenticationException(ERROR_MESSAGES.AUTH.INVALID_PASSWORD);
    }

    try {
      await this.prisma.microPost.deleteMany({
        where: {
          user_id: user.id,
        },
      });
    } catch (error) {
      throw new DatabaseException(ERROR_MESSAGES.DATABASE.POST.DELETE_FAILED);
    }

    try {
      await this.prisma.user.delete({
        where: {
          id: user.id,
        },
      });
    } catch (error) {
      throw new DatabaseException(ERROR_MESSAGES.DATABASE.USER.DELETE_FAILED);
    }

    try {
      await this.prisma.auth.delete({
        where: {
          user_id: user.id,
        },
      });
    } catch (error) {
      throw new DatabaseException(ERROR_MESSAGES.DATABASE.AUTH.DELETE_FAILED);
    }

    return {
      success: true,
      message: 'user and all related data are deleted',
    };
  }
}
