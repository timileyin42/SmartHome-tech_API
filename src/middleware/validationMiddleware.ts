import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';

const deviceSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
});

const controlDeviceStatusSchema = Joi.object({
  status: Joi.string().valid('on', 'off').required(),
});

export const validateDevice = (req: Request, res: Response, next: NextFunction) => {
  const { error } = deviceSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      details: error.details
    });
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


export const handleValidationErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
  // handle validation errors
};

export const validateControlDeviceStatus = (req: Request, res: Response, next: NextFunction) => {
  const { error } = controlDeviceStatusSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      details: error.details
    });
  }

  next();
};
