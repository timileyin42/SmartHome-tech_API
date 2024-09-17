import { Router } from 'express';
import {
  getDevices,
  getDevice,
  createDevice,
  updateDevice,
  deleteDevice,
  controlDevice,
} from '../controllers/deviceController';
import {
  validateDevice,
  validateControlDevice,
  handleValidationErrors
} from '../middleware/validationMiddleware';
import authenticateJWT from '../middleware/authMiddleware';
import { validateObjectId } from '../middleware/objectIdValidationMiddleware';
import { deviceActionsConfig } from '../deviceActionsConfig';

const router = Router();

// Device routes with authentication
router.use(authenticateJWT);

// Device routes
router.get('/', getDevices); // GET /api/devices
router.get('/:id', validateObjectId, getDevice); // GET /api/devices/:id
router.post('/', validateDevice, handleValidationErrors, createDevice); // POST /api/devices
router.put('/:id', validateObjectId, validateDevice, handleValidationErrors, updateDevice); // PUT /api/devices/:id
router.delete('/:id', validateObjectId, deleteDevice); // DELETE /api/devices/:id

// Device control route
router.post('/:id/control', validateObjectId, validateControlDevice, handleValidationErrors, controlDevice); // POST /api/devices/:id/control

export default router;

