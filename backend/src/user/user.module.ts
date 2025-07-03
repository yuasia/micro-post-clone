import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthHelperService } from 'src/common/services/auth-helper.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, AuthHelperService],
})
export class UserModule {}
