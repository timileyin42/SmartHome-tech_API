import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define an interface to extend Request with a user property
interface CustomRequest extends Request {
    user?: any;
}

const authenticateJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export default authenticateJWT;

