// src/middleware/errorMiddleware.ts
import { Request, Response, NextFunction } from 'express';

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);  // Log the error details
    res.status(500).json({
        message: 'Something went wrong!',
        error: err.message,
    });
};

export default errorMiddleware;

