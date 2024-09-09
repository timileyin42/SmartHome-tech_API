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
import { validateDevice, handleValidationErrors } from '../middleware/validationMiddleware';
import { validateControlDevice } from '../middleware/validationMiddleware';
import authenticateJWT from '../middleware/authMiddleware';

const router = Router();

// Device routes with authentication
router.use(authenticateJWT);

router.get('/', getDevices);               // GET /api/devices
router.get('/:id', getDevice);             // GET /api/devices/:id
router.post('/', validateDevice, handleValidationErrors, createDevice); // POST /api/devices
router.put('/:id', validateDevice, handleValidationErrors, updateDevice); // PUT /api/devices/:id
router.delete('/:id', deleteDevice);       // DELETE /api/devices/:id

// Device control routes
router.post('/:id/on', turnOnDevice);      // POST /api/devices/:id/on
router.post('/:id/off', turnOffDevice);    // POST /api/devices/:id/off
router.post('/:id/state', setDeviceState); // POST /api/devices/:id/state
router.post('/:id/control', validateControlDevice, handleValidationErrors, controlDevice); // POST /api/devices/:id/control

export default router;

