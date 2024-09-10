// src/controllers/cameraController.ts

import { Request, Response, NextFunction } from 'express';

export const controlCamera = (req: Request, res: Response, next: NextFunction) => {
  const { action, duration } = req.body;

  switch (action) {
    case 'on':
      // Logic to turn on the camera
      return res.json({ message: 'Camera turned on' });
    case 'off':
      // Logic to turn off the camera
      return res.json({ message: 'Camera turned off' });
    case 'record':
      // Logic to start recording, use 'duration' if provided
      return res.json({ message: `Camera started recording for ${duration || 'indefinite'} seconds` });
    case 'snapshot':
      // Logic to take a snapshot
      return res.json({ message: 'Snapshot taken' });
    default:
      return res.status(400).json({ message: 'Invalid action' });
  }
};

