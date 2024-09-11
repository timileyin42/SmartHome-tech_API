import mongoose, { Document, Schema } from 'mongoose';

// Define the Smart Door schema
const smartDoorSchema = new Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['locked', 'unlocked'], required: true },
  type: { type: String, default: 'door' },
}, { timestamps: true });

// Create a TypeScript interface for the Smart Door model
export interface ISmartDoor extends Document {
  name: string;
  status: 'locked' | 'unlocked';
  type: string;
}

// Create and export the Smart Door model
const SmartDoor = mongoose.model<ISmartDoor>('SmartDoor', smartDoorSchema);
export default SmartDoor;

