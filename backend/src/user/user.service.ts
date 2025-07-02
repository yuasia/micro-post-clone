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
import { AuthHelperService } from 'src/common/services/auth-helper.service';
import { USER_CONSTRAINTS } from 'src/common/constants/user.constants';

interface UserUpdateData {
  updated_at: Date;
  name?: string;
  email?: string;
  avatar_url?: string;
  hash?: string;
}

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authHelper: AuthHelperService,
  ) {}

  private validatePassword(password: string) {
    if (
      password.length < USER_CONSTRAINTS.PASSWORD.MIN_LENGTH ||
      password.length > USER_CONSTRAINTS.PASSWORD.MAX_LENGTH ||
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

  private async buildUpdateData(
    dto: UpdateUserDto,
    user: any,
    userId: number,
  ): Promise<any> {
    const updateData: UserUpdateData = { updated_at: new Date() };

    if (dto.name) {
      updateData.name = dto.name;
    }
    if (dto.email) {
      await this.validateAndSetEmail(dto.email, userId, updateData);
    }
    if (dto.avatar_url) {
      updateData.avatar_url = dto.avatar_url;
    }
    if (dto.password) {
      await this.validateAndSetPassword(dto, user, updateData);
    }

    return updateData;
  }

  private async validateAndSetEmail(
    email: string,
    userId: number,
    updateData: UserUpdateData,
  ) {
    this.validateEmail(email);

    const exist = await this.prisma.user.findUnique({
      where: {
        email: email,
        NOT: { id: userId },
      },
    });
    if (exist) {
      throw new ValidationException(
        ERROR_MESSAGES.VALIDATION.EMAIL_ALREADY_EXISTS,
      );
    }
    updateData.email = email;
  }

  private async validateAndSetPassword(
    dto: UpdateUserDto,
    user: any,
    updateData: UserUpdateData,
  ) {
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
  }

  private async executeUserUpdate(userId: number, updateData: UserUpdateData) {
    try {
      const updated = await this.prisma.user.update({
        where: { id: userId },
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
    const auth = await this.authHelper.validateTokenAndAuth(token);

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
    const auth = await this.authHelper.validateTokenAndAuth(token);

    const user = await this.prisma.user.findUnique({
      where: {
        id: auth.user_id,
      },
    });

    if (!user) {
      throw new AuthenticationException(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    const updateData = await this.buildUpdateData(dto, user, auth.user_id);

    return await this.executeUserUpdate(auth.user_id, updateData);
  }

  async deleteUser(token: string, password: string) {
    const auth = await this.authHelper.validateTokenAndAuth(token);

    const user = await this.prisma.user.findFirst({
      where: {
        id: auth.user_id,
      },
    });

    if (!user) {
      throw new AuthenticationException(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    const hash = crypto
      .createHash(USER_CONSTRAINTS.HASH.ALGORITHM)
      .update(password)
      .digest('hex');

    this.validatePassword(password);

    if (hash !== user.hash) {
      throw new AuthenticationException(ERROR_MESSAGES.AUTH.INVALID_PASSWORD);
    }

    return await this.prisma.$transaction(async (prisma) => {
      try {
        await prisma.microPost.deleteMany({
          where: { user_id: user.id },
        });

        await prisma.user.delete({
          where: { id: user.id },
        });

        await prisma.auth.delete({
          where: { user_id: user.id },
        });

        return {
          success: true,
          message: 'user and all related data deleted successfully',
        };
      } catch (error) {
        throw new DatabaseException(
          ERROR_MESSAGES.DATABASE.USER.DELETE_FAILED,
          error,
        );
      }
    });
  }
}
