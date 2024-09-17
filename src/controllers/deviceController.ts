import { Request, Response, NextFunction } from 'express';
import Device from '../models/Device';
import { body, validationResult } from 'express-validator';
import { Types } from 'mongoose';
import { deviceActionsConfig } from '../deviceActionsConfig'; // Import the configuration

// Utility function to check if a string is a valid ObjectId
const isValidObjectId = (id: string): boolean => {
    return Types.ObjectId.isValid(id);
};

// Validation middleware for device operations
export const validateDevice = [
    body('type').isString().notEmpty().withMessage('Type is required'),
    body('status').optional().isIn(['on', 'off', 'locked', 'unlocked', 'busy']).withMessage('Status must be either "on", "off", "locked", "unlocked", or "busy"'),
];

export const validateDeviceUpdate = [
    body('name').optional().isString().notEmpty().withMessage('Name must be a string if provided'),
    body('type').optional().isString().notEmpty().withMessage('Type must be a string if provided'),
    body('status').optional().isIn(['on', 'off', 'locked', 'unlocked', 'busy']).withMessage('Status must be either "on", "off", "locked", "unlocked", or "busy" if provided'),
];

// Helper function for handling validation errors
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// CRUD operations with error handling

// Get all devices
export const getDevices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const devices = await Device.find();
        res.json(devices);
    } catch (error) {
        next(error); // Pass error to the error middleware
    }
};

// Get a single device by ID
export const getDevice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid device ID format' });
        }
        const device = await Device.findById(req.params.id);
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        res.json(device);
    } catch (error) {
        next(error); // Pass error to the error middleware
    }
};

// Create a new device
export const createDevice = [
    ...validateDevice,
    handleValidationErrors,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newDevice = new Device(req.body);
            await newDevice.save();
            res.status(201).json(newDevice);
        } catch (error) {
            next(error); // Pass error to the error middleware
        }
    }
];

// Update an existing device
export const updateDevice = [
    ...validateDeviceUpdate,
    handleValidationErrors,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const device = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!device) {
                return res.status(404).json({ message: 'Device not found' });
            }
            res.json(device);
        } catch (error) {
            next(error); // Pass error to the error middleware
        }
    }
];

// Delete a device
export const deleteDevice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid device ID format' });
        }
        const device = await Device.findByIdAndDelete(req.params.id);
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        res.json({ message: 'Device deleted' });
    } catch (error) {
        next(error); // Pass error to the error middleware
    }
};

// Combined controlDevice function with validation and action control
export const controlDevice = [
  // Validation for control device
  body('status')
    .optional()
    .isIn(['on', 'off', 'locked', 'Dim', 'unlocked', 'busy', 'Decreasing Temperature', 'Increasing Temperature'])
    .withMessage('Invalid status'),

  body('action')
    .optional()
    .isIn(['Turn On', 'Turn Off', 'Dim', 'lock', 'unlock', 'open', 'close', 'IncreaseTemp', 'DecreaseTemp'])
    .withMessage('Invalid action'),

  body('command')
    .optional()
    .isIn(['increase_temperature', 'decrease_temperature', 'moon_light'])
    .withMessage('Invalid command'),

  handleValidationErrors,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid device ID format' });
      }

      const { status, action, command } = req.body;
      const device = await Device.findById(req.params.id);

      if (!device) {
        return res.status(404).json({ message: 'Device not found' });
      }

      const deviceConfig = deviceActionsConfig[device.type];

      if (!deviceConfig) {
        return res.status(400).json({ message: 'Unsupported device type' });
      }

      // Validate action or command
      if (action && !deviceConfig.actions.includes(action)) {
        return res.status(400).json({ message: `Invalid action for ${device.type}` });
      }
      if (command && command !== deviceConfig.defaultCommand) {
        return res.status(400).json({ message: `Invalid command for ${device.type}` });
      }

      // Update status and handle specific device actions
      device.status = status;

      switch (device.type) {
        case 'light':
          if (action === 'Dim') {
            device.brightness = req.body.value || 50; // Default brightness value if not provided
          }
          break;

        case 'ac':
          if (action === 'Turn On') {
            device.status = 'on';
          } else if (action === 'Turn Off') {
            device.status = 'off';
          } else if (action === 'IncreaseTemp') {
            device.temperature = (device.temperature || 20) + (req.body.value || 1);
          } else if (action === 'DecreaseTemp') {
            device.temperature = (device.temperature || 20) - (req.body.value || 1);
          } else if (action === 'Fan') {
            device.fan = true; // Assume fan is a boolean or similar
          }
          break;

        case 'moon_light':
          // Specific logic for moon_light device
          if (command === 'moon_light') {
            // Custom moon_light behavior if needed
          }
          break;

        case 'refrigerator':
          if (action === 'Turn On') {
            device.status = 'on';
          } else if (action === 'Turn Off') {
            device.status = 'off';
          }
          break;

        default:
          // For devices with no specific action, apply default behavior
          break;
      }

      await device.save();
      res.json({ message: `Device ${device.type} updated`, device });
    } catch (error) {
      next(error); // Pass error to the error middleware
    }
  }
];


// Set custom device state (e.g., temperature, brightness)
export const setDeviceState = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid device ID format' });
        }
        const device = await Device.findById(req.params.id);
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        const state = req.body; // Example: { temperature: 22, brightness: 75 }
        Object.assign(device, state);
        await device.save();
        res.json({ message: 'Device state updated', device });
    } catch (error) {
        next(error); // Pass error to the error middleware
    }
};

