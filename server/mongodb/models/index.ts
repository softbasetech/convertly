import mongoose, { Schema, model, Document, Model } from 'mongoose';

// User Model Interface
export interface IUser extends Document {
  id: number;
  username: string;
  email: string;
  password: string;
  displayName: string | null;
  googleId: string | null;
  role: string;
  dailyConversionsRemaining: number;
  lastConversionReset: Date | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  isPro: boolean;
  createdAt: Date;
}

// Conversion Model Interface
export interface IConversion extends Document {
  id: number;
  userId: number;
  sourceFormat: string;
  targetFormat: string;
  originalFilename: string;
  convertedFilename: string;
  status: string;
  createdAt: Date;
}

// QR Code Model Interface
export interface IQRCode extends Document {
  id: number;
  userId: number;
  content: string;
  type: string;
  backgroundColor: string | null;
  foregroundColor: string | null;
  createdAt: Date;
}

// API Key Model Interface
export interface IAPIKey extends Document {
  id: number;
  userId: number;
  key: string;
  name: string;
  lastUsed: Date | null;
  createdAt: Date;
}

// User Schema
const UserSchema = new Schema<IUser>({
  id: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  displayName: { type: String, default: null },
  googleId: { type: String, default: null },
  role: { type: String, default: 'user' },
  dailyConversionsRemaining: { type: Number, default: 5 },
  lastConversionReset: { type: Date, default: Date.now },
  stripeCustomerId: { type: String, default: null },
  stripeSubscriptionId: { type: String, default: null },
  isPro: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Conversion Schema
const ConversionSchema = new Schema<IConversion>({
  id: { type: Number, required: true, unique: true },
  userId: { type: Number, required: true },
  sourceFormat: { type: String, required: true },
  targetFormat: { type: String, required: true },
  originalFilename: { type: String, required: true },
  convertedFilename: { type: String, required: true },
  status: { type: String, required: true, default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

// QR Code Schema
const QRCodeSchema = new Schema<IQRCode>({
  id: { type: Number, required: true, unique: true },
  userId: { type: Number, required: true },
  content: { type: String, required: true },
  type: { type: String, required: true, default: 'url' },
  backgroundColor: { type: String, default: '#FFFFFF' },
  foregroundColor: { type: String, default: '#000000' },
  createdAt: { type: Date, default: Date.now }
});

// API Key Schema
const APIKeySchema = new Schema<IAPIKey>({
  id: { type: Number, required: true, unique: true },
  userId: { type: Number, required: true },
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  lastUsed: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

// Payment Model Interface
export interface IPayment extends Document {
  id: number;
  userId: number;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  provider: string;
  providerReference: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

// Payment Schema
const PaymentSchema = new Schema<IPayment>({
  id: { type: Number, required: true, unique: true },
  userId: { type: Number, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
  provider: { type: String, required: true },
  providerReference: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

// Define models or get them if they already exist
// PaystackLog Interface
export interface IPaystackLog extends Document {
  id: number;
  event: string;
  data: Record<string, any>;
  createdAt: Date;
}

// PaystackLog Schema
const PaystackLogSchema = new Schema<IPaystackLog>({
  id: { type: Number, required: true, unique: true },
  event: { type: String, required: true },
  data: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const User: Model<IUser> = mongoose.models.User || model<IUser>('User', UserSchema);
export const Conversion: Model<IConversion> = mongoose.models.Conversion || model<IConversion>('Conversion', ConversionSchema);
export const QRCode: Model<IQRCode> = mongoose.models.QRCode || model<IQRCode>('QRCode', QRCodeSchema);
export const APIKey: Model<IAPIKey> = mongoose.models.APIKey || model<IAPIKey>('APIKey', APIKeySchema);
export const Payment: Model<IPayment> = mongoose.models.Payment || model<IPayment>('Payment', PaymentSchema);
export const PaystackLog: Model<IPaystackLog> = mongoose.models.PaystackLog || model<IPaystackLog>('PaystackLog', PaystackLogSchema);