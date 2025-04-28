import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    getAuth: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('getAuth', () => {
    it('should return auth data', async () => {
      const mockAuthServiceData = { id: 1, password: 'password' };
      mockAuthService.getAuth.mockResolvedValue(mockAuthServiceData);

      const result = await controller.getAuth('user_id', 'password');
      expect(service.getAuth).toHaveBeenCalledWith('user_id', 'password');
      expect(result).toEqual(mockAuthServiceData);
    });
  });
});
