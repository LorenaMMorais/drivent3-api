import { prisma } from '@/config';

async function findAllHotels() {
  return prisma.hotel.findMany();
}

async function findHotelById(hotelId: number) {
  return prisma.hotel.findUnique({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

const hotelsRepository = {
  findAllHotels,
  findHotelById,
};

export default hotelsRepository;
