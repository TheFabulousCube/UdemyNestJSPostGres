import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import {
  JWTheader,
  mockCreateUserDTO,
  mockCreatedUser,
  mockExistingUser,
  mockExistingUserDTO,
  mockResponse,
  mockUserEntity,
} from './mockUsers';

const mockUserRepository = {
  findOneBy: jest.fn((user: UserEntity) => {
    if (
      user.email == mockExistingUser.email ||
      user.username == mockExistingUser.username
    ) {
      return Promise.resolve(mockExistingUser);
    }
    return Promise.resolve(null);
  }),
  save: jest.fn((user: UserEntity) => {
    return Promise.resolve(user);
  }),
};

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('user repository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  it('generates a token', () => {
    expect(service.generateJwt(mockUserEntity)).toContain(JWTheader);
  });

  it('builds a user response', () => {
    expect(service.buildUserResponse(mockUserEntity)).toStrictEqual(
      mockResponse,
    );
  });

  describe('createUser', () => {
    it('checks the db for email', async () => {
      const test = await service.createUser(mockCreateUserDTO);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: mockCreateUserDTO.email,
      });
    });

    it('checks the db for username', async () => {
      const test = await service.createUser(mockCreateUserDTO);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        username: mockCreateUserDTO.username,
      });
    });
    it('should create a new user', async () => {
      const test = await service.createUser(mockCreateUserDTO);
      expect(test).toEqual(mockCreatedUser);
    });

    it('should reject duplicates', async () => {
      await expect(
        service.createUser(mockExistingUserDTO),
      ).rejects.toThrowError('something is already taken.');
    });
  });
});
