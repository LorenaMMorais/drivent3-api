import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.city(),
    },
  });
}

export async function createRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: Number(faker.random.numeric()),
      hotelId: hotelId,
    },
  });
}

export async function rooms(hotelId: number) {
  return prisma.room.findMany({
    where: {
      hotelId,
    },
  });
}
