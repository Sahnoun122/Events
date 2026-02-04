import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Role } from 'src/common/enums/role.enum';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
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
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const mockResult = {
        user: {
          _id: 'user123',
          fullName: registerDto.fullName,
          email: registerDto.email,
          roles: [Role.PARTICIPANT],
        },
      };

      mockAuthService.register.mockResolvedValue(mockResult);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockResult);
    });

    it('should register an admin user successfully', async () => {
      const registerDto = {
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        roles: ['admin'],
      };

      const mockResult = {
        user: {
          _id: 'admin123',
          fullName: registerDto.fullName,
          email: registerDto.email,
          roles: [Role.ADMIN],
        },
      };

      mockAuthService.register.mockResolvedValue(mockResult);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      const mockResult = {
        access_token: 'jwt-token-123',
        user: {
          _id: 'user123',
          fullName: 'John Doe',
          email: loginDto.email,
          roles: [Role.PARTICIPANT],
        },
      };

      mockAuthService.login.mockResolvedValue(mockResult);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(result).toEqual(mockResult);
    });

    it('should login admin user successfully', async () => {
      const loginDto = {
        email: 'admin@example.com',
        password: 'admin123',
      };

      const mockResult = {
        access_token: 'admin-jwt-token-123',
        user: {
          _id: 'admin123',
          fullName: 'Admin User',
          email: loginDto.email,
          roles: [Role.ADMIN],
        },
      };

      mockAuthService.login.mockResolvedValue(mockResult);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(result).toEqual(mockResult);
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
