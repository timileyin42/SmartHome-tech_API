import { Request, Response, NextFunction } from 'express';
import Device from '../models/Device';
import { body, validationResult } from 'express-validator';
import { Types } from 'mongoose';

// Utility function to check if a string is a valid ObjectId
const isValidObjectId = (id: string): boolean => {
    return Types.ObjectId.isValid(id);
};

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
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validation for controlling a device (only 'status' is required)
export const validateDeviceControl = [
    body('status').isIn(['on', 'off']).withMessage('Status must be either "on" or "off"'),
];

// CRUD operations with error handling

export const getDevices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const devices = await Device.find();
        res.json(devices);
    } catch (error) {
        next(error); // Pass error to the error middleware
    }
};

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

export const createDevice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        handleValidationErrors(req, res, next);  // Handle validation
        const newDevice = new Device(req.body);
        await newDevice.save();
        res.status(201).json(newDevice);
    } catch (error) {
        next(error); // Pass error to the error middleware
    }
};

export const updateDevice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        handleValidationErrors(req, res, next);  // Handle validation
        const device = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        res.json(device);
    } catch (error) {
        next(error); // Pass error to the error middleware
    }
};

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

export const controlDevice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid device ID format' });
        }
        const device = await Device.findById(req.params.id);
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        device.status = req.body.status;
        await device.save();
        res.json({ message: 'Device status updated', device });
    } catch (error) {
        next(error); // Pass error to the error middleware
    }
};

export const turnOnDevice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid device ID format' });
        }
        const device = await Device.findById(req.params.id);
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        device.status = 'on';
        await device.save();
        res.json({ message: 'Device turned on', device });
    } catch (error) {
        next(error); // Pass error to the error middleware
    }
};

export const turnOffDevice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid device ID format' });
        }
        const device = await Device.findById(req.params.id);
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        device.status = 'off';
        await device.save();
        res.json({ message: 'Device turned off', device });
    } catch (error) {
        next(error); // Pass error to the error middleware
    }
};

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

