import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserResponseInterface } from 'src/types/userResponse.interface';
import { CreateUserDto } from 'src/dto/createUser.dto';

let JWTheader = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
let mockCreateUserDTO: CreateUserDto = {
  username: 'mockUser',
  email: 'someone@somewhere.com',
  password: 'mockPass',
};

let mockUserEntity: UserEntity = {
  id: 1,
  username: 'mockUser',
  email: 'someone@somewhere.com',
  bio: '',
  image: '',
  password: 'mockPass',
  favorites: [],
  followers: [],
  following: [],
  articles: [],
  toUserResponseInterface: function (user): UserResponseInterface {
    return {
      user: {
        email: 'someone@somewhere.com',
        token: JWTheader,
        username: 'mockUser',
        bio: 'self',
        image: 'imageURL',
      },
    };
  },
} as UserEntity;

let mockResponse: UserResponseInterface = {
  user: {
    email: 'someone@somewhere.com',
    token: JWTheader,
    username: 'mockUser',
    bio: 'self',
    image: 'imageURL',
  },
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
          useValue: {
            findOneBy: jest.fn((user: UserEntity) => {
              return Promise.resolve(null);
            }),
            save: jest.fn(() => {
              return Promise.resolve(mockUserEntity);
            }),
          },
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
    it('should create a new user', async () => {
      const test = await service.createUser(mockCreateUserDTO);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: mockCreateUserDTO.email,
      });
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        username: mockCreateUserDTO.username,
      });
      expect(test).toBe(mockUserEntity);
    });
  });
});
