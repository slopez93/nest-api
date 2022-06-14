import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/shared/infrastructure/nest/app.module';
import { CreateAccountRequest } from '../../createAccount/CreateAccountRequest';

describe('CreateAccountController e2e test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('when post to /account then create account and return it', async () => {
    const createAccountRequest: CreateAccountRequest = {
      cash: 10,
    };
    const { body, status } = await request(app.getHttpServer())
      .post(`/accounts`)
      .send(createAccountRequest);

    expect(status).toEqual(201);
    expect(body).toEqual({
      cash: 10,
      id: expect.stringMatching(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i),
      issuers: [],
    });
  });
});
