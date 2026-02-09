import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('TicketsController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/tickets/:reservationId (GET) should require authentication', () => {
    return request(app.getHttpServer())
      .get('/tickets/507f1f77bcf86cd799439011')
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});