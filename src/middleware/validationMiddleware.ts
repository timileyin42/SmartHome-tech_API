import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';

// Existing schemas for devices and device control
const deviceSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
});

const controlDeviceStatusSchema = Joi.object({
  status: Joi.string().valid('on', 'off').required(),
});

// Schema for control device validation
const controlDeviceSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().valid('light', 'ac').required(), // Adjust this based on your device types
  status: Joi.string().valid('on', 'off').required(),
  command: Joi.string().valid('increase_temperature', 'decrease_temperature', 'moon_light').optional(),
  value: Joi.number().optional()
});

// Schema for creating automation rules
const createAutomationRuleSchema = Joi.object({
  name: Joi.string().required(),
  trigger: Joi.object({
    type: Joi.string().valid('time', 'sensor').required(),
    value: Joi.string().required() // Time string or sensor ID and value
  }).required(),
  condition: Joi.object({
    type: Joi.string(),
    value: Joi.string()
  }).optional(), // Optional in creation
  action: Joi.object({
    type: Joi.string().required(),
    value: Joi.string().required()
  }).required()
});

const cameraControlSchema = Joi.object({
  action: Joi.string().valid('on', 'off', 'record', 'snapshot').required(),
  duration: Joi.number().optional(), // For 'record' action, this can specify the duration
  status: Joi.string().optional(), // Make status optional
});

// Schema for updating automation rules
const updateAutomationRuleSchema = Joi.object({
  name: Joi.string(),
  trigger: Joi.object({
    type: Joi.string().valid('time', 'sensor'),
    value: Joi.string() // Time string or sensor ID and value
  }).optional(),
  condition: Joi.object({
    type: Joi.string(),
    value: Joi.string()
  }).optional(),
  action: Joi.object({
    type: Joi.string(),
    value: Joi.string()
  }).optional()
});

// Middleware functions
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

export const validateControlDeviceStatus = (req: Request, res: Response, next: NextFunction) => {
	console.log("validateControlDeviceStatus middleware invoked");
  const { error } = controlDeviceStatusSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      details: error.details
    });
  }

  next();
};

// Middleware for creating automation rules
export const validateCreateAutomationRule = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createAutomationRuleSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      details: error.details
    });
  }
  next();
};

// Middleware for updating automation rules
export const validateUpdateAutomationRule = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateAutomationRuleSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      details: error.details
    });
  }
  next();
};

export const validateCameraControl = (req: Request, res: Response, next: NextFunction) => {
	console.log("validateCameraControl middleware invoked");
	console.log('req.body:', req.body);
  const { error } = cameraControlSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      details: error.details,
    });
  }

  next();
};

// Error handling middleware
export const handleValidationErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
  // handle validation errors
  if (err) {
    return res.status(400).json({
      message: 'Validation error',
      details: err.message || 'An unexpected error occurred'
    });
  }
  next();
};

