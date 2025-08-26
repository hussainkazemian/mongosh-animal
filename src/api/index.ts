import express, { Request, Response } from 'express';
import { MessageResponse } from '../types/Messages';
import categoryRoute from './routes/categoryRoute';
import speciesRoute from './routes/speciesRoute';
import animalRoute from './routes/animalRoute';

const router = express.Router();

router.get<{}, MessageResponse>('/', (_req: Request, res: Response) => {
  res.json({
    message: 'api v1',
  });
});

export default router;
