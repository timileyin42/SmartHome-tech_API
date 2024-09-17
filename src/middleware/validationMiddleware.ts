import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';

// Existing schemas for devices and device control
const deviceSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  status: Joi.string().valid('on', 'off', 'locked', 'unlocked', 'busy', 'Decreasing Temperature', 'Increasing Temperature').optional(),
});

const controlDeviceStatusSchema = Joi.object({
  status: Joi.string().valid('on', 'off', 'locked', 'unlocked', 'busy', 'Decreasing Temperature', 'Increasing Temperature').required(),
  action: Joi.string().valid('lock', 'unlock', 'open', 'close', 'Dim', 'IncreasTemp', 'DecreaseTemp').optional(), // Include valid actions for smart doors

});

// Schema for control device validation
const controlDeviceSchema = Joi.object({
  type: Joi.string().valid('light', 'ac', 'refrigerator', 'moon_light').required(),
  status: Joi.string().valid('on', 'off', 'Dim', 'locked', 'unlocked', 'busy', 'Decreasing Temperature', 'Increasing Temperature').required(),
  action: Joi.string().valid(
    'Turn On', 'Turn Off', 'Dim', 'lock', 'unlock', 'open', 'close', 'IncreaseTemp', 'DecreaseTemp'
  ).when('type', {
    is: Joi.string().valid('refrigerator'),
    then: Joi.string().valid('Turn On', 'Turn Off') // Only 'on' and 'off' for refrigerators
  }).when('type', {
    is: Joi.string().valid('ac'),
    then: Joi.string().valid('on', 'off', 'IncreaseTemp', 'DecreaseTemp') // Actions for air conditioners
  }).when('type', {
    is: Joi.string().valid('light'),
    then: Joi.string().valid('Turn On', 'Turn Off', 'Dim') // Actions for lights
  }).when('type', {
    is: Joi.string().valid('moon_light'),
    then: Joi.string().valid('on', 'off', 'Dim') // Actions for moon light
  }).optional(),
  command: Joi.string().valid(
    'increase_temperature', 'decrease_temperature', 'moon_light'
  ).when('type', {
    is: Joi.string().valid('refrigerator'),
    then: Joi.forbidden() // Command is not allowed for refrigerators
  }).when('type', {
    is: Joi.string().valid('ac'),
    then: Joi.string().valid('increase_temperature', 'decrease_temperature') // Commands for air conditioners
  }).when('type', {
    is: Joi.string().valid('moon_light'),
    then: Joi.string().valid('moon_light') // Commands for moon light
  }).allow('', null).optional(), // Allow empty string or null for other types
  value: Joi.number().optional() // Allow numerical values for actions like temperature adjustment
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
  status: Joi.string().valid('on', 'off').optional(), // Make status optional
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

// Schema for TV control validation
const tvControlSchema = Joi.object({
  action: Joi.string().valid('on', 'off', 'volume_up', 'volume_down', 'change_channel').required(),
  status: Joi.string().optional(), // Make status optional for TV
  volume: Joi.number().optional(), // For volume actions
  channel: Joi.alternatives().try(Joi.string(), Joi.number()).optional(), // Accept both string and number
});

// Schema for smart door control validation
const smartDoorControlSchema = Joi.object({
  status: Joi.string().valid('locked', 'unlocked', 'busy').required(),
  action: Joi.string().valid('lock', 'unlock').required(),
});

// Middleware functions
export const validateDevice = (req: Request, res: Response, next: NextFunction) => {
  console.log('req.body:', req.body);
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
  console.log('validateControlDevice middleware invoked');
  console.log('req.body:', req.body);
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
  action: Joi.string().valid('Turn On', 'Turn Off', 'Dim', 'Increasing Temperature', 'DecreasingTemperature').required(),

  console.log('req.body:', req.body);
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
  console.log('req.body:', req.body);
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
  console.log('req.body:', req.body);
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
      details: error.details
    });
  }

  next();
};

// Middleware for validating TV control requests
export const validateTVControl = (req: Request, res: Response, next: NextFunction) => {
  console.log("validateTVControl middleware invoked");
  console.log('req.body:', req.body);
  const { error } = tvControlSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      details: error.details,
    });
  }

  next();
};

// Middleware for validating smart door control requests
export const validateSmartDoorControl = (req: Request, res: Response, next: NextFunction) => {
  console.log("validateSmartDoorControl middleware invoked");
  console.log('req.body:', req.body);

  const { error } = smartDoorControlSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

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

