import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { AdminUser } from '../../database/entities/admin-user.entity';

const mockAdmin = (overrides: Partial<AdminUser> = {}): AdminUser =>
  ({
    id: 'admin-1',
    email: 'admin@sfbu.edu',
    passwordHash: 'hashed',
    role: 'system_admin',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as AdminUser;

describe('AuthService', () => {
  let service: AuthService;
  let adminRepo: any;
  let jwtService: any;

  beforeEach(async () => {
    adminRepo = { findOne: jest.fn() };
    jwtService = { sign: jest.fn().mockReturnValue('signed.token.here') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(AdminUser), useValue: adminRepo },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateCredentials()', () => {
    it('throws UnauthorizedException when user not found', async () => {
      adminRepo.findOne.mockResolvedValue(null);
      await expect(
        service.validateCredentials('no@user.com', 'pass'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when password is wrong', async () => {
      const admin = mockAdmin({
        passwordHash: await bcrypt.hash('correct', 10),
      });
      adminRepo.findOne.mockResolvedValue(admin);

      await expect(
        service.validateCredentials('admin@sfbu.edu', 'wrong'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns user when credentials are valid', async () => {
      const password = 'correct-password';
      const admin = mockAdmin({
        passwordHash: await bcrypt.hash(password, 10),
      });
      adminRepo.findOne.mockResolvedValue(admin);

      const result = await service.validateCredentials(
        'admin@sfbu.edu',
        password,
      );
      expect(result).toBe(admin);
    });

    it('queries by email and isActive:true', async () => {
      adminRepo.findOne.mockResolvedValue(null);
      await service
        .validateCredentials('test@sfbu.edu', 'pass')
        .catch(() => {});

      expect(adminRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'test@sfbu.edu', isActive: true },
      });
    });
  });

  describe('signToken()', () => {
    it('returns a token string', () => {
      const admin = mockAdmin();
      const token = service.signToken(admin);
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('calls jwtService.sign with sub, email, role payload', () => {
      const admin = mockAdmin();
      service.signToken(admin);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: admin.id,
        email: admin.email,
        role: admin.role,
      });
    });
  });

  describe('findById()', () => {
    it('returns admin user when found', async () => {
      const admin = mockAdmin();
      adminRepo.findOne.mockResolvedValue(admin);

      const result = await service.findById('admin-1');
      expect(result).toBe(admin);
      expect(adminRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'admin-1', isActive: true },
      });
    });

    it('returns null when not found', async () => {
      adminRepo.findOne.mockResolvedValue(null);
      const result = await service.findById('missing');
      expect(result).toBeNull();
    });
  });
});
