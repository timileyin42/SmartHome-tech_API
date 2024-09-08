// src/custom.d.ts
import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: any; // Or define a more specific type if possible
        }
    }
}

