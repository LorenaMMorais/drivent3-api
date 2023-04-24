import { Response, Request } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const allHotels = await hotelsService.getHotels();

    return res.status(httpStatus.OK).send(allHotels);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;

  try {
    const oneHotel = await hotelsService.getHotel(Number(id));

    return res.status(httpStatus.OK).send(oneHotel);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND);
  }
}
