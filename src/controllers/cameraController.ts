// src/controllers/cameraController.ts

import { Request, Response, NextFunction } from 'express';
import Camera from '../models/cameraModel'; // Import the Camera model

export const controlCamera = async (req: Request, res: Response, next: NextFunction) => {
  const { action, duration } = req.body;

  try {
    // Find or create a camera document
    let camera = await Camera.findOne();
    if (!camera) {
      camera = new Camera();
    }

    switch (action) {
      case 'on':
        camera.status = 'on';
        await camera.save();
        return res.json({ message: 'Camera turned on' });

      case 'off':
        camera.status = 'off';
        await camera.save();
        return res.json({ message: 'Camera turned off' });

      case 'record':
        camera.status = 'recording';
        camera.duration = duration || 0; // Set the duration or default to 0
        await camera.save();
        return res.json({ message: `Camera started recording for ${duration || 'indefinite'} seconds` });

      case 'snapshot':
        camera.status = 'snapshot';
        await camera.save();
        return res.json({ message: 'Snapshot taken' });

      default:
        return res.status(400).json({ message: 'Invalid action' });
    }
  } catch (err) {
    next(err);
  }
};

