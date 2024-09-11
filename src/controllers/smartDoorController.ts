import { Request, Response } from 'express';

export const controlSmartDoor = (req: Request, res: Response) => {
  const { action } = req.body;

  switch (action) {
    case 'lock':
      // Logic to lock the door
      return res.json({ message: 'Door locked' });
    case 'unlock':
      // Logic to unlock the door
      return res.json({ message: 'Door unlocked' });
    default:
      return res.status(400).json({ message: 'Invalid action' });
  }
};

