import { CreateUserDto } from '../dto/createUser.dto';
import { UserResponseInterface } from '../types/userResponse.interface';
import { UserEntity } from './user.entity';

/**
 * Encoded Header for JWT token
 */
export const JWTheader = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

/**
 * New user DTO, from API call
 * won't collide on insert
 */
export const mockCreateUserDTO: CreateUserDto = {
  username: 'mockUser',
  email: 'someone@somewhere.com',
  password: 'mockPass',
};

/**
 * Existing User Create DTO
 * will be rejected on insert
 */
export const mockExistingUserDTO: CreateUserDto = {
  username: 'mockExistingUser',
  email: 'existing@somewhere.com',
  password: 'mockPass',
};

/**
 * New user entity,
 * won't collide on insert
 */
export const mockUserEntity: UserEntity = {
  id: 5,
  username: mockCreateUserDTO.username,
  email: mockCreateUserDTO.email,
  bio: 'self',
  image: 'imageURL',
  password: mockCreateUserDTO.password,
  favorites: [],
  followers: [],
  following: [],
  articles: [],
  toUserResponseInterface: function (user): UserResponseInterface {
    return {
      user: {
        email: mockCreateUserDTO.email,
        token: JWTheader,
        username: mockCreateUserDTO.username,
        bio: 'self',
        image: 'imageURL',
      },
    };
  },
} as UserEntity;

/**
 * Existing User Entity
 * will be rejected on insert
 */
export const mockExistingUser: UserEntity = {
  id: 1,
  username: mockExistingUserDTO.username,
  email: mockExistingUserDTO.email,
  bio: 'self',
  image: 'imageURL',
  password: mockExistingUserDTO.password,
  favorites: [],
  followers: [],
  following: [],
  articles: [],
  toUserResponseInterface: function (user): UserResponseInterface {
    return {
      user: {
        email: mockExistingUserDTO.email,
        token: JWTheader,
        username: mockExistingUserDTO.username,
        bio: 'self',
        image: 'imageURL',
      },
    };
  },
} as UserEntity;

/**
 *  result from buildUserResponse()
 */
export const mockResponse: UserResponseInterface = {
  user: {
    email: mockCreateUserDTO.email,
    token: JWTheader,
    username: mockCreateUserDTO.username,
    bio: 'self',
    image: 'imageURL',
  },
};

/**
 * Newly created user sent to controller
 */
export const mockCreatedUser: UserEntity = {
  email: mockCreateUserDTO.email,
  username: mockCreateUserDTO.username,
  password: mockCreateUserDTO.password,
  bio: undefined,
  image: undefined,
  id: undefined,
  favorites: undefined,
  followers: undefined,
  following: undefined,
  articles: undefined,
} as UserEntity;
