import { notFoundError } from '@/errors';
import hotelsRepository from '@/repositories/hotel-repository';

async function getHotels() {
  const hotels = await hotelsRepository.findAllHotels();

  if (!hotels) throw notFoundError();

  return hotels;
}

async function getHotel(id: number) {
  const hotel = await hotelsRepository.findHotelById(id);

  if (!hotel) throw notFoundError();

  return hotel;
}

const hotelsService = {
  getHotels,
  getHotel,
};

export default hotelsService;
