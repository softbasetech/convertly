import mongoose from 'mongoose';
import * as dotenv from "dotenv"
dotenv.config()

// Track connection status
let isConnected = false;

// MongoDB connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export async function connectToDatabase() {
  if (isConnected || global.mongoose) {
    console.log('Using existing MongoDB connection');
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MongoDB URI is not defined in environment variables');
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = !!db.connections[0].readyState;
    
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}