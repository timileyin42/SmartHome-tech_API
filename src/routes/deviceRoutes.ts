import { Router, Request, Response, NextFunction } from 'express';
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
import { validateControlDevice } from '../middleware/validationMiddleware';
import { validateDevice, handleValidationErrors, validateControlDeviceStatus, validateCameraControl } from '../middleware/validationMiddleware';
import authenticateJWT from '../middleware/authMiddleware';
import { isValidObjectId } from '../utils/utilityFunctions';
import { controlCamera } from '../controllers/cameraController';

const router = Router();

// Device routes with authentication
router.use(authenticateJWT);

// Camera control route
router.post(
  '/camera/control',
  validateCameraControl,
  handleValidationErrors,
  (req: Request, res: Response, next: NextFunction) => {
    console.log('POST /api/devices/camera/control route handler invoked');
    controlCamera(req, res, next);
  }
); // POST /api/devices/camera/control

// Device routes
router.get('/', getDevices); // GET /api/devices

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid device ID' });
    }
    await getDevice(req, res, next);
  } catch (error) {
    next(error);
  }
}); // GET /api/devices/:id

router.post('/', validateDevice, handleValidationErrors, createDevice); // POST /api/devices

router.put('/:id', validateDevice, handleValidationErrors, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid device ID' });
    }
    await updateDevice(req, res, next);
  } catch (error) {
    next(error);
  }
}); // PUT /api/devices/:id

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid device ID' });
    }
    await deleteDevice(req, res, next);
  } catch (error) {
    next(error);
  }
}); // DELETE /api/devices/:id

// Device control routes
router.post('/:id/on', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid device ID' });
    }
    await turnOnDevice(req, res, next);
  } catch (error) {
    next(error);
  }
}); // POST /api/devices/:id/on

router.post('/:id/off', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid device ID' });
    }
    await turnOffDevice(req, res, next);
  } catch (error) {
    next(error);
  }
}); // POST /api/devices/:id/off

router.post('/:id/state', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid device ID' });
    }
    await setDeviceState(req, res, next);
  } catch (error) {
    next(error);
  }
}); // POST /api/devices/:id/state

// Device control route
router.post(
  '/:id/control',
  validateControlDeviceStatus,
  handleValidationErrors,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid device ID' });
      }
      await controlDevice(req, res, next);
    } catch (error) {
      next(error);
    }
  }
); // POST /api/devices/:id/control

export default router;

