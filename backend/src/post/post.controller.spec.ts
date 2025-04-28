import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { PostController } from './post.controller';
import { PostService } from './post.service';

describe('PostController', () => {
  let controller: PostController;
  let service: PostService;

  const mockPostService = {
    getList: jest.fn(),
    createPost: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: mockPostService,
        },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);
  });

  describe('getList', () => {
    it('should return a list of posts', async () => {
      const mockPostServiceList = [
        { id: 1, title: 'Post 1' },
        { id: 2, title: 'Post 2' },
      ];
      mockPostService.getList.mockResolvedValue(mockPostServiceList);

      const result = await controller.getList('xxx-xxx-xxx', 0, 10);
      expect(service.getList).toHaveBeenCalledWith('xxx-xxx-xxx', 0, 10);
      expect(result).toEqual(mockPostServiceList);
    });
  });

  describe('createPost', () => {
    it('should call createPost', async () => {
      const message = 'Hello World';
      const token = 'xxx-xxx-xxx';

      await controller.createPost(message, token);
      expect(service.createPost).toHaveBeenCalledWith(message, token);
    });
  });
});
