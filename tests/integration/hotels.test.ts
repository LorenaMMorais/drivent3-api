/* eslint-disable @typescript-eslint/no-empty-function */
import httpStatus from 'http-status';
import supertest from 'supertest';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createUser,
  createEnrollmentWithAddress,
  createTicket,
  createHotel,
  createRoom,
  rooms,
  createADifferentTicketType,
} from '../factories';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('Should respond with status 200 if token is valid', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createADifferentTicketType(false, true);
    const hotel = await createHotel();

    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(result.body).toEqual([
      {
        id: hotel.id,
        name: hotel.name,
        image: hotel.image,
        createdAt: hotel.createdAt.toISOString(),
        updatedAt: hotel.updatedAt.toISOString(),
      },
    ]);

    expect(result.status).toBe(httpStatus.OK);
  });

  it('Should respond with status 401 if no token', async () => {
    const result = await server.get('/hotels');

    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with status 401 if given token is invalid', async () => {
    const token = faker.lorem.word();

    const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with status 402 if tycketType of user is remote', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createADifferentTicketType(false, true);

    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('Should respond with status 402 if user does not have a paid ticket', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createADifferentTicketType(false, true);

    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('Should respond with status 404 if user does not have a ticket', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.NOT_FOUND);
  });
});

describe('GET /hotels/:hotelId', () => {
  it('Should respond with status 200 if token is valid', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createADifferentTicketType(false, true);
    const hotel = await createHotel();
    const hotelWithRooms = await createRoom(hotel.id);

    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    await createRoom(hotel.id);

    const result = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

    expect(result.body).toEqual(
      expect.objectContaining({
        id: hotel.id,
        name: hotel.name,
        image: hotel.image,
        createdAt: hotel.createdAt.toISOString(),
        updatedAt: hotel.updatedAt.toISOString(),

        Rooms: expect.arrayContaining([
          {
            id: hotelWithRooms.id,
            name: hotelWithRooms.name,
            capacity: hotelWithRooms.capacity,
            hotelId: hotelWithRooms.hotelId,
            createdAt: hotelWithRooms.createdAt.toISOString(),
            updatedAt: hotelWithRooms.updatedAt.toISOString(),
          },
        ]),
      }),
    );
  });

  it('Should respond with status 400 if the hotel does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createADifferentTicketType(false, true);

    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const result = await server.get('/hotels/0').set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.NOT_FOUND);
  });

  it('Should respond with status 401 if no token', async () => {
    const result = await server.get('/hotels/hotelId');

    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with status 401 if given token is invalid', async () => {
    const token = faker.lorem.word();

    const result = await server.get('/hotels/hotelId').set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const result = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });
});
