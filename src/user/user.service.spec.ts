import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

jest.mock('../user/user.service');
jest.mock('@nestjs/jwt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        JwtService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object if username and password are correct', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: await bcrypt.hash('password123', 12),
        email: 'test@example.com',
      };

      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser as any);

      const result = await service.validateUser('testuser', 'password123');

      expect(result).toEqual({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      });
    });

    it('should return null if username or password are incorrect', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);

      const result = await service.validateUser('testuser', 'incorrectpassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token if user is provided', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'password123', // Not hashed for simplicity
        email: 'test@example.com',
      };

      const accessToken = 'mockAccessToken';
      jest.spyOn(jwtService, 'sign').mockReturnValue(accessToken);

      const result = await service.login(mockUser);

      expect(result).toEqual({ access_token: accessToken });
    });
  });
});
