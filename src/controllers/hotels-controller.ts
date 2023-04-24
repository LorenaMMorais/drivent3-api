import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const allHotels = await hotelsService.getHotels(userId);

    return res.status(httpStatus.OK).send(allHotels);
  } catch (error) {
    if (error.name === 'ConflictError') {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }

    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const { hotelId } = req.params;

  try {
    const oneHotel = await hotelsService.getHotel(Number(hotelId));

    return res.status(httpStatus.OK).send(oneHotel);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
