// src/routes/weatherRoutes.ts
import express from 'express';
import { adjustDevicesBasedOnWeather } from '../controllers/weatherController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.post('/adjust-weather', authMiddleware, adjustDevicesBasedOnWeather);

export default router;

