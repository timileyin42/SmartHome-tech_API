import mongoose, { Document, Schema } from 'mongoose';

// Define the ICamera interface to include status and optional duration
interface ICamera extends Document {
  status: string;
  duration?: number; // Optional field
}

// Define the Camera schema
const CameraSchema: Schema<ICamera> = new Schema({
  status: {
    type: String,
    enum: ['on', 'off', 'recording', 'snapshot'], // Update enum to include 'recording' and 'snapshot'
    default: 'off'
  },
  duration: {
    type: Number,
    default: 0 // Default to 0 if not provided
  }
});

// Create the Camera model
const Camera = mongoose.model<ICamera>('Camera', CameraSchema);

export default Camera;

