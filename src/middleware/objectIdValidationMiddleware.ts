import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from '../utils/utilityFunctions';

export const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid device ID' });
  }
  next();
};

