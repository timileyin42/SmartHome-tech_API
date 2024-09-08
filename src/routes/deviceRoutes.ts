// src/routes/deviceRoutes.ts

import { Router } from 'express';
import {
    getDevices,
    getDevice,
    createDevice,
    updateDevice,
    deleteDevice,
    turnOnDevice,
    turnOffDevice,
    setDeviceState,
    controlDevice,
} from '../controllers/deviceController';
import {
    validateDevice,
    handleValidationErrors
} from '../controllers/deviceController';
import authenticateJWT from '../middleware/authMiddleware';

const router = Router();

// Device routes with authentication
router.use(authenticateJWT);

router.get('/devices', getDevices);
router.get('/devices/:id', getDevice);
router.post('/devices', validateDevice, handleValidationErrors, createDevice);
router.put('/devices/:id', validateDevice, handleValidationErrors, updateDevice);
router.delete('/devices/:id', deleteDevice);

// Device control routes
router.post('/devices/:id/on', turnOnDevice);
router.post('/devices/:id/off', turnOffDevice);
router.post('/devices/:id/state', setDeviceState);
router.post('/devices/:id/control', validateDevice, handleValidationErrors, controlDevice);

export default router;
