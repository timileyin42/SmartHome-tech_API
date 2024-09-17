import mongoose, { Schema, Document } from 'mongoose';

interface IDevice extends Document {
  name: string;
  status?: string; // Made status optional
  type: string;
  createdAt: Date;
  brightness?: number; // Add brightness
  temperature?: number; // Add temperature
  fan?: boolean; // Add fan
}

const DeviceSchema: Schema = new Schema({
  name: { type: String, required: true },
  status: { type: String, required: false }, // Made status optional
  type: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  brightness: { type: Number, required: false }, // Add brightness field
  temperature: { type: Number, required: false }, // Add temperature field
  fan: { type: Boolean, required: false }, // Add fan field
});

const Device = mongoose.model<IDevice>('Device', DeviceSchema);
export default Device;

