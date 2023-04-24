/* eslint-disable @typescript-eslint/no-empty-function */
import httpStatus from 'http-status';
import supertest from 'supertest';
import faker from '@faker-js/faker';
import { cleanDb, generateValidToken } from '../helpers';
import { createUser } from '../factories';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('Should respond with status 401 if no token', async () => {
    const result = await server.get('/hotels');

    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with status 401 if given token is invalid', async () => {
    const token = faker.lorem.word();

    const result = await server.get('/enrollments').set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with status 200 if token is valid', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.OK);
  });
});
