import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    console.log('MongoDB already connected');
    return;
  }

  try {
    console.log('Attempting to connect to MongoDB with URI:', process.env.MONGODB_URI?.substring(0, 50) + '...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/7weight', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('✅ MongoDB connected successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.error('Error details:', (error as Error).message);
  }
}