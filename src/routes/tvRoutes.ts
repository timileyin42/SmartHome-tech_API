// src/routes/tvRoutes.ts

import { Router } from 'express';
import { validateTVControl } from '../middleware/validationMiddleware';
import { controlTV } from '../controllers/tvController';

const router = Router();

router.post('/control', validateTVControl, controlTV);

export default router;

