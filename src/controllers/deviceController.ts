import { Request, Response } from 'express';
import Device from '../models/Device';
import { body, validationResult } from 'express-validator';

// Validation middleware for device operations
export const validateDevice = [
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('type').isString().notEmpty().withMessage('Type is required'),
    body('status').isIn(['on', 'off']).withMessage('Status must be either "on" or "off"'),
];

export const validateDeviceUpdate = [
    body('name').optional().isString().notEmpty().withMessage('Name must be a string if provided'),
    body('type').optional().isString().notEmpty().withMessage('Type must be a string if provided'),
    body('status').optional().isIn(['on', 'off']).withMessage('Status must be either "on" or "off" if provided'),
];

// Helper function for handling validation errors
export const handleValidationErrors = (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
};

// CRUD operations with validation

export const getDevices = async (req: Request, res: Response) => {
    try {
        const devices = await Device.find();
        res.json(devices);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getDevice = async (req: Request, res: Response) => {
    try {
        const device = await Device.findById(req.params.id);
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        res.json(device);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createDevice = async (req: Request, res: Response) => {
  try {
    await handleValidationErrors(req, res); // Assuming handleValidationErrors is an async function
    const newDevice = new Device(req.body);
    await newDevice.save();
    res.status(201).json(newDevice);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateDevice = [
    ...validateDeviceUpdate,
    async (req: Request, res: Response) => {
        handleValidationErrors(req, res);
        try {
            const device = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!device) {
                return res.status(404).json({ message: 'Device not found' });
            }
            res.json(device);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }
];

export const deleteDevice = async (req: Request, res: Response) => {
    try {
        const device = await Device.findByIdAndDelete(req.params.id);
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        res.json({ message: 'Device deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const controlDevice = async (req: Request, res: Response) => {
    try {
        const device = await Device.findById(req.params.id);
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        device.status = req.body.status || device.status;
        await device.save();
        res.json(device);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const turnOnDevice = async (req: Request, res: Response) => {
    try {
        const device = await Device.findById(req.params.id);
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        device.status = 'on';
        await device.save();
        res.json({ message: 'Device turned on', device });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const turnOffDevice = async (req: Request, res: Response) => {
    try {
        const device = await Device.findById(req.params.id);
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        device.status = 'off';
        await device.save();
        res.json({ message: 'Device turned off', device });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const setDeviceState = async (req: Request, res: Response) => {
    try {
        const device = await Device.findById(req.params.id);
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        const state = req.body; // Example: { temperature: 22, brightness: 75 }
        Object.assign(device, state);
        await device.save();
        res.json({ message: 'Device state updated', device });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

