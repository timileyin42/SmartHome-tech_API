import mongoose, { Schema, Document } from 'mongoose';

interface IDevice extends Document {
  name: string;
  status?: string; // Made status optional
  type: string;
  createdAt: Date;
}

const DeviceSchema: Schema = new Schema({
  name: { type: String, required: true },
  status: { type: String, required: false }, // Made status optional
  type: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Device = mongoose.model<IDevice>('Device', DeviceSchema);
export default Device;

