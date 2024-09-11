// src/models/tvModel.ts

import mongoose, { Document, Schema } from 'mongoose';

interface ITV extends Document {
  name: string;
  status: string; // 'on' or 'off'
  volume: number; // Volume level
  channel: number; // TV channel
  createdAt: Date;
}

const tvSchema = new Schema<ITV>({
  name: { type: String, required: true },
  status: { type: String, enum: ['on', 'off'], required: true },
  volume: { type: Number, default: 0 },
  channel: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

const TV = mongoose.model<ITV>('TV', tvSchema);

export default TV;

