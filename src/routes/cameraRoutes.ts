// src/routes/cameraRoutes.ts

import express from 'express';
import { controlCamera } from '../controllers/cameraController';
import { validateCameraControl } from '../middleware/validationMiddleware';
import authenticateJWT from '../middleware/authMiddleware';

const router = express.Router();

// POST route to control the camera
router.post('/control', authenticateJWT, validateCameraControl, controlCamera);

export default router;

