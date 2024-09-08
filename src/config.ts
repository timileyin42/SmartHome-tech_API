import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config(); // Load environment variables

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI as string;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in the environment variables');
    }
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;

