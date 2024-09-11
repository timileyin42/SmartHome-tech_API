import { Router } from 'express';
import { validateSmartDoorControl } from '../middleware/validationMiddleware'; // Import validation middleware
import { controlSmartDoor } from '../controllers/smartDoorController'; // Import controller

const router = Router();

// Route to control the smart door
router.post('/control', validateSmartDoorControl, controlSmartDoor);

export default router;

