import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserResponseInterface } from 'src/types/userResponse.interface';
import { ExpressRequest } from 'src/types/expressRequest.interface';

let mockRequest = {
  id: 1,
  email: 'someone@somewhere.com',
  username: 'mockUser',
  bio: 'self',
  image: 'imageURL',
  password: '',
  favorites: [],
  followers: [],
  following: [],
  articles: [],
} as UserEntity;

let mockResponse: UserResponseInterface = {
  user: {
    email: 'someone@somewhere.com',
    token: '',
    username: 'mockUser',
    bio: 'self',
    image: 'imageURL',
  },
};

describe('UserController', () => {
  let userController: UserController;
  let appService: UserService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUser: jest.fn(),
            createUser: jest.fn(),
            loginUser: jest.fn(),
            updateUser: jest.fn(),
            buildUserResponse: jest.fn(() => {
              return Promise.resolve(mockResponse);
            }),
          },
        },
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('should return the current user', async () => {
    const value = await userController.currentUser(
      mockRequest as unknown as ExpressRequest,
    );
    expect(value).toEqual(mockResponse);
  });

  it('should return create user', async () => {
    const value = await userController.createUser(mockRequest);
    expect(value).toEqual(mockResponse);
  });

  it('should return logged in user', async () => {
    const value = await userController.loginUser(mockRequest);
    expect(value).toEqual(mockResponse);
  });

  it('should return updated user', async () => {
    const value = await userController.updateCurrentUser(
      mockRequest as any as ExpressRequest,
      mockRequest,
    );
    expect(value).toEqual(mockResponse);
  });
});
