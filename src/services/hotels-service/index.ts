import { notFoundError, conflictError } from '@/errors';
import hotelsRepository from '@/repositories/hotel-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

async function getHotels(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) throw notFoundError();

  const { TicketType } = await ticketsRepository.findTickeWithTypeById(ticket.id);

  if (TicketType.isRemote || ticket.status === 'RESERVED') throw conflictError("You don't have authorization");

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
