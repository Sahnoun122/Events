import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { Role } from '../common/enums/role.enum';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe('validate', () => {
    it('should return user object from JWT payload for participant user', async () => {
      const payload = {
        sub: 'user123',
        email: 'john@example.com',
        roles: [Role.PARTICIPANT],
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: payload.sub,
        email: payload.email,
        roles: payload.roles,
      });
    });

    it('should return user object from JWT payload for admin user', async () => {
      const payload = {
        sub: 'admin123',
        email: 'admin@example.com',
        roles: [Role.ADMIN],
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: payload.sub,
        email: payload.email,
        roles: payload.roles,
      });
    });

    it('should handle multiple roles', async () => {
      const payload = {
        sub: 'user123',
        email: 'multi@example.com',
        roles: [Role.ADMIN, Role.PARTICIPANT],
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: payload.sub,
        email: payload.email,
        roles: payload.roles,
      });
    });

    it('should handle empty roles array', async () => {
      const payload = {
        sub: 'user123',
        email: 'noroles@example.com',
        roles: [],
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: payload.sub,
        email: payload.email,
        roles: payload.roles,
      });
    });
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });
});