import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { Role } from '../common/enums/role.enum';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should successfully register a new user with participant role', async () => {
      const hashedPassword = 'hashedPassword123';
      const createdUser = {
        _id: 'user123',
        fullName: registerDto.fullName,
        email: registerDto.email,
        password: hashedPassword,
        roles: [Role.PARTICIPANT],
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      mockUsersService.create.mockResolvedValue(createdUser);

      const result = await authService.register(registerDto);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(mockUsersService.create).toHaveBeenCalledWith({
        fullName: registerDto.fullName,
        email: registerDto.email,
        password: hashedPassword,
        roles: [Role.PARTICIPANT],
      });
      expect(result).toEqual({
        user: {
          _id: createdUser._id,
          fullName: createdUser.fullName,
          email: createdUser.email,
          roles: createdUser.roles,
        },
      });
    });

    it('should register user with admin role when provided', async () => {
      const adminRegisterDto = {
        ...registerDto,
        roles: 'admin',
      };

      const hashedPassword = 'hashedPassword123';
      const createdUser = {
        _id: 'admin123',
        fullName: adminRegisterDto.fullName,
        email: adminRegisterDto.email,
        password: hashedPassword,
        roles: [Role.ADMIN],
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      mockUsersService.create.mockResolvedValue(createdUser);

      const result = await authService.register(adminRegisterDto);

      expect(mockUsersService.create).toHaveBeenCalledWith({
        fullName: adminRegisterDto.fullName,
        email: adminRegisterDto.email,
        password: hashedPassword,
        roles: ['admin'],
      });
      expect(result.user.roles).toEqual([Role.ADMIN]);
    });

    it('should handle roles as array', async () => {
      const adminRegisterDto = {
        ...registerDto,
        roles: ['admin'],
      };

      const hashedPassword = 'hashedPassword123';
      const createdUser = {
        _id: 'admin123',
        fullName: adminRegisterDto.fullName,
        email: adminRegisterDto.email,
        password: hashedPassword,
        roles: [Role.ADMIN],
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      mockUsersService.create.mockResolvedValue(createdUser);

      await authService.register(adminRegisterDto);

      expect(mockUsersService.create).toHaveBeenCalledWith({
        fullName: adminRegisterDto.fullName,
        email: adminRegisterDto.email,
        password: hashedPassword,
        roles: ['admin'],
      });
    });

    it('should throw BadRequestException if email already exists', async () => {
      const existingUser = {
        _id: 'existing123',
        email: registerDto.email,
        fullName: 'Existing User',
        password: 'hashedPassword',
        roles: [Role.PARTICIPANT],
      };

      mockUsersService.findByEmail.mockResolvedValue(existingUser);

      await expect(authService.register(registerDto)).rejects.toThrow(BadRequestException);
      await expect(authService.register(registerDto)).rejects.toThrow('email already exists');

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(mockUsersService.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginCredentials = {
      email: 'john@example.com',
      password: 'password123',
    };

    const mockUser = {
      _id: 'user123',
      fullName: 'John Doe',
      email: loginCredentials.email,
      password: 'hashedPassword123',
      roles: [Role.PARTICIPANT],
    };

    it('should successfully login with valid credentials', async () => {
      const mockToken = 'jwt-token-123';

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await authService.login(loginCredentials.email, loginCredentials.password);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(loginCredentials.email);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(loginCredentials.password, mockUser.password);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser._id,
        email: mockUser.email,
        roles: mockUser.roles,
      });
      expect(result).toEqual({
        access_token: mockToken,
        user: {
          _id: mockUser._id,
          fullName: mockUser.fullName,
          email: mockUser.email,
          roles: mockUser.roles,
        },
      });
    });

    it('should throw BadRequestException for non-existent user', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login(loginCredentials.email, loginCredentials.password),
      ).rejects.toThrow(BadRequestException);
      await expect(
        authService.login(loginCredentials.email, loginCredentials.password),
      ).rejects.toThrow('email ou mot de passe incorect');

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(loginCredentials.email);
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for incorrect password', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      await expect(
        authService.login(loginCredentials.email, loginCredentials.password),
      ).rejects.toThrow(BadRequestException);
      await expect(
        authService.login(loginCredentials.email, loginCredentials.password),
      ).rejects.toThrow('email ou mot de incorrecte ');

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(loginCredentials.email);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(loginCredentials.password, mockUser.password);
    });

    it('should handle admin user login', async () => {
      const adminUser = {
        ...mockUser,
        roles: [Role.ADMIN],
      };

      const mockToken = 'admin-jwt-token-123';

      mockUsersService.findByEmail.mockResolvedValue(adminUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await authService.login(loginCredentials.email, loginCredentials.password);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: adminUser._id,
        email: adminUser.email,
        roles: adminUser.roles,
      });
      expect(result.user.roles).toEqual([Role.ADMIN]);
    });
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
