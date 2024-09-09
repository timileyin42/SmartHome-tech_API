import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Define the schema for device validation
const deviceSchema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid('light', 'camera', 'ac', 'tv').required(),
    status: Joi.string().valid('on', 'off').required(),
});

// Middleware to validate the device data
export const validateDevice = (req: Request, res: Response, next: NextFunction) => {
    const { error } = deviceSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: 'Validation failed', details: error.details });
    }

    next();
};

// Define the schema for control device validation
const controlDeviceSchema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid('light', 'ac').required(), // Adjust this based on your device types
    status: Joi.string().valid('on', 'off').required(),
    command: Joi.string().valid('increase_temperature', 'decrease_temperature', 'moon_light').optional(),
    value: Joi.number().optional()
});

// Middleware to validate control device requests
export const validateControlDevice = (req: Request, res: Response, next: NextFunction) => {
    const { error } = controlDeviceSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: 'Validation failed',
            details: error.details
        });
    }

    next();
};

// Middleware to handle validation errors if any
export const handleValidationErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        res.status(400).json({ message: 'Validation Error', error: err.message });
    } else {
        next();
    }
};

