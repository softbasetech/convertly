import mongoose, { Schema, model, Document, Model } from 'mongoose';

// User Model Interface
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  displayName?: string;
  googleId?: string;
  isPro: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  dailyConversionsLeft: number;
  createdAt: Date;
  updatedAt: Date;
}

// Conversion Model Interface
export interface IConversion extends Document {
  userId: mongoose.Types.ObjectId;
  sourceFormat: string;
  targetFormat: string;
  sourceFileName: string;
  targetFileName: string;
  fileSize: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// QR Code Model Interface
export interface IQRCode extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  type: string;
  backgroundColor?: string;
  foregroundColor?: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Key Model Interface
export interface IAPIKey extends Document {
  userId: mongoose.Types.ObjectId;
  key: string;
  name: string;
  isActive: boolean;
  lastUsed?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  displayName: { type: String },
  googleId: { type: String },
  isPro: { type: Boolean, default: false },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  dailyConversionsLeft: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Conversion Schema
const ConversionSchema = new Schema<IConversion>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sourceFormat: { type: String, required: true },
  targetFormat: { type: String, required: true },
  sourceFileName: { type: String, required: true },
  targetFileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  status: { type: String, required: true, default: 'completed' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// QR Code Schema
const QRCodeSchema = new Schema<IQRCode>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { type: String, required: true, default: 'url' },
  backgroundColor: { type: String, default: '#FFFFFF' },
  foregroundColor: { type: String, default: '#000000' },
  logo: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// API Key Schema
const APIKeySchema = new Schema<IAPIKey>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  lastUsed: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Define models or get them if they already exist
export const User: Model<IUser> = mongoose.models.User || model<IUser>('User', UserSchema);
export const Conversion: Model<IConversion> = mongoose.models.Conversion || model<IConversion>('Conversion', ConversionSchema);
export const QRCode: Model<IQRCode> = mongoose.models.QRCode || model<IQRCode>('QRCode', QRCodeSchema);
export const APIKey: Model<IAPIKey> = mongoose.models.APIKey || model<IAPIKey>('APIKey', APIKeySchema);