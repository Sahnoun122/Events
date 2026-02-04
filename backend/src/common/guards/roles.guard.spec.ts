import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { Role } from '../enums/role.enum';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);

    jest.clearAllMocks();
  });

  const createMockExecutionContext = (user: any): ExecutionContext => {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      }),
    } as any;
  };

  describe('canActivate', () => {
    it('should allow access when no roles are required', () => {
      const context = createMockExecutionContext({ roles: [Role.PARTICIPANT] });
      mockReflector.getAllAndOverride.mockReturnValue(null);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow access when user has required admin role', () => {
      const user = { id: 'admin123', roles: [Role.ADMIN] };
      const context = createMockExecutionContext(user);
      mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow access when user has required participant role', () => {
      const user = { id: 'user123', roles: [Role.PARTICIPANT] };
      const context = createMockExecutionContext(user);
      mockReflector.getAllAndOverride.mockReturnValue([Role.PARTICIPANT]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should deny access when user does not have required role', () => {
      const user = { id: 'user123', roles: [Role.PARTICIPANT] };
      const context = createMockExecutionContext(user);
      mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should allow access when user has one of multiple required roles', () => {
      const user = { id: 'admin123', roles: [Role.ADMIN] };
      const context = createMockExecutionContext(user);
      mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN, Role.PARTICIPANT]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should handle user with multiple roles', () => {
      const user = { id: 'user123', roles: [Role.ADMIN, Role.PARTICIPANT] };
      const context = createMockExecutionContext(user);
      mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should deny access when user has no roles', () => {
      const user = { id: 'user123', roles: [] };
      const context = createMockExecutionContext(user);
      mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should deny access when user has undefined roles', () => {
      const user = { id: 'user123' }; // No roles property
      const context = createMockExecutionContext(user);
      mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should deny access when user is undefined', () => {
      const context = createMockExecutionContext(undefined);
      mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});