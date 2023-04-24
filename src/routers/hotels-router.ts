import { Router } from 'express';
import { getAllHotels, getHotelById } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const hotelRouter = Router();

hotelRouter.all('/*', authenticateToken).get('/', getAllHotels).get('/:hotelId', getHotelById);

export { hotelRouter };
