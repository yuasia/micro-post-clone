import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    getUser: jest.fn(),
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('getUser', () => {
    it('should return a user', async () => {
      const mockUser = { id: 1, name: 'John' };
      mockUserService.getUser.mockResolvedValue(mockUser);

      const result = await controller.getUser(1, 'xxx-xxx-xxx');
      expect(service.getUser).toHaveBeenCalledWith('xxx-xxx-xxx', 1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('createUser', () => {
    it('should call createUser', async () => {
      const name = 'Alice';
      const email = 'alice@example.com';
      const password = 'password123';

      await controller.createUser(name, email, password);
      expect(service.createUser).toHaveBeenCalledWith(name, email, password);
    });
  });
});
