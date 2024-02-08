import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a new user', () => {
    return request(app.getHttpServer())
      .post('/users/register')
      .send({
        username: 'testuser',
        password: 'testpassword',
        email: 'test@example.com',
      })
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body).toBeDefined();
        expect(response.body.data.username).toBe('testuser');
      });
  });

  it('should log in with correct credentials', () => {
    return request(app.getHttpServer())
      .post('/users/login')
      .send({
        username: 'testuser',
        password: 'testpassword',
      })
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body).toBeDefined();
        expect(response.body.access_token).toBeDefined();
      });
  });

  it('should not log in with incorrect credentials', () => {
    return request(app.getHttpServer())
      .post('/users/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword',
      })
      .expect(HttpStatus.UNAUTHORIZED);
  });
});
